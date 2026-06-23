import { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../utils/async-handler";
import { FormDefinitionSchema } from "@repo/types";
import prisma from "../lib/db";

// ============================================
// GET /api/v1/forms — list user's forms
// ============================================

export const listForms: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const userId = res.locals.user.id as string;

    const forms = await prisma.form.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        iconSymbol: true,
        coverUrl: true,
        published: true,
        slug: true,
        responseCount: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ success: true, data: forms });
  },
);

// ============================================
// POST /api/v1/forms — create a new form
// Body is pre-validated by the validate() middleware
// ============================================

export const createForm: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user.id as string;
    const { title, description, coverUrl, iconSymbol, requireEmail, slug, definition } =
      req.body;

    const form = await prisma.form.create({
      data: {
        userId,
        title,
        description,
        coverUrl,
        iconSymbol,
        requireEmail,
        slug,
        // Store the full FormDefinition object as jsonb
        fields: definition,
      },
    });

    res.status(201).json({ success: true, data: form });
  },
);

// ============================================
// GET /api/v1/forms/:id — get a single form
// ============================================

export const getForm: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user.id as string;

    const form = await prisma.form.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!form) {
      res.status(404).json({ success: false, message: "Form not found" });
      return;
    }

    // Parse and validate the fields JSON coming out of the DB.
    // safeParse so a corrupt DB row doesn't crash the server.
    const definitionResult = FormDefinitionSchema.safeParse(form.fields);
    if (!definitionResult.success) {
      console.error(`Corrupt form definition for form ${form.id}:`, definitionResult.error);
      res.status(500).json({ success: false, message: "Form definition is malformed" });
      return;
    }

    res.json({ success: true, data: { ...form, definition: definitionResult.data } });
  },
);

// ============================================
// PATCH /api/v1/forms/:id — update a form
// Body is pre-validated by the validate() middleware
// ============================================

export const updateForm: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user.id as string;

    const existing = await prisma.form.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: "Form not found" });
      return;
    }

    const { title, description, coverUrl, iconSymbol, requireEmail, slug, definition } =
      req.body;

    const updated = await prisma.form.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(coverUrl !== undefined && { coverUrl }),
        ...(iconSymbol !== undefined && { iconSymbol }),
        ...(requireEmail !== undefined && { requireEmail }),
        ...(slug !== undefined && { slug }),
        // Only update fields if definition was provided in the request
        ...(definition !== undefined && { fields: definition }),
      },
    });

    res.json({ success: true, data: updated });
  },
);

// ============================================
// DELETE /api/v1/forms/:id
// ============================================

export const deleteForm: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user.id as string;

    const existing = await prisma.form.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: "Form not found" });
      return;
    }

    await prisma.form.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Form deleted" });
  },
);

// ============================================
// POST /api/v1/forms/:id/publish — toggle published
// ============================================

export const togglePublish: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user.id as string;

    const form = await prisma.form.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!form) {
      res.status(404).json({ success: false, message: "Form not found" });
      return;
    }

    const updated = await prisma.form.update({
      where: { id: req.params.id },
      data: { published: !form.published },
    });

    res.json({ success: true, data: updated });
  },
);
