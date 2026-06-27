import { Prisma } from "@prisma/client";
import { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../utils/async-handler";
import { FormDefinitionSchema } from "@repo/types";
import { CreateFormInput, UpdateFormInput } from "../lib/form-schemas";
import prisma from "../lib/db";

// ============================================
// GET /api/v1/forms — list user's forms
// ============================================

export const listForms: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user.id as string;

    // 1. Extract query params
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const search = req.query.search as string | undefined;
    const published = req.query.published as string | undefined;
    // 2. Build where clause
    const whereClause: Prisma.FormWhereInput = { userId };

    if (search) {
      whereClause.title = { contains: search, mode: "insensitive" };
    }

    if (published !== undefined) {
      whereClause.published = published === "true";
    }
    // 3. Fetch data and count in parallel
    const parsedSkip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
    const skip = parsedSkip !== undefined && !isNaN(parsedSkip) ? parsedSkip : (page - 1) * limit;

    const [forms, total] = await Promise.all([
      prisma.form.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
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
      }),
      prisma.form.count({ where: whereClause })
    ]);
    // 4. Return paginated response
    res.json({
      success: true,
      data: forms,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  },
);

// ============================================
// POST /api/v1/forms — create a new form
// Body is pre-validated by the validate() middleware
// ============================================

export const createForm: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user.id as string;
    const { title, description, coverUrl, iconSymbol, requireEmail, slug, definition, type } = req.body as CreateFormInput;

    try {
      const form = await prisma.form.create({
        data: {
          userId,
          title,
          description,
          coverUrl,
          iconSymbol,
          requireEmail,
          slug,
          type,
          // Store the full FormDefinition object as jsonb
          fields: definition,
        },
        select: {
          id: true, title: true, description: true, iconSymbol: true,
          coverUrl: true, published: true, slug: true, type: true,
          requireEmail: true, responseCount: true, viewCount: true,
          fields: true, createdAt: true, updatedAt: true,
        },
      });
      const definitionResult = FormDefinitionSchema.safeParse(form.fields);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { fields: _fields, ...formWithoutFields } = form;
      res.status(201).json({
        success: true, data: { ...formWithoutFields, definition: definitionResult.success ? definitionResult.data : form.fields }
      });
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        res.status(409).json({ success: false, message: "A form with this slug already exists" });
        return;
      }
      throw err;
    }
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
      select: {
        id: true, title: true, description: true, iconSymbol: true,
        coverUrl: true, published: true, slug: true, type: true,
        requireEmail: true, responseCount: true, viewCount: true,
        fields: true, // needed to parse into definition
        createdAt: true, updatedAt: true,
      },
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fields: _fields, ...formWithoutFields } = form;
    res.json({ success: true, data: { ...formWithoutFields, definition: definitionResult.data } });
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

    const { title, description, coverUrl, iconSymbol, requireEmail, slug, definition, type } = req.body as UpdateFormInput;

    try {
      const updated = await prisma.form.update({
        where: { id: req.params.id },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(coverUrl !== undefined && { coverUrl }),
          ...(iconSymbol !== undefined && { iconSymbol }),
          ...(requireEmail !== undefined && { requireEmail }),
          ...(slug !== undefined && { slug }),
          ...(type !== undefined && { type }),
          ...(definition !== undefined && { fields: definition }),

        },
        select: {
          id: true, title: true, description: true, iconSymbol: true,
          coverUrl: true, published: true, slug: true, type: true,
          requireEmail: true, responseCount: true, viewCount: true,
          fields: true, createdAt: true, updatedAt: true,
        },
      });
      const definitionResult = FormDefinitionSchema.safeParse(updated.fields);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { fields: _fields, ...formWithoutFields } = updated;
      res.json({
        success: true, data: {
          ...formWithoutFields,
          definition: definitionResult.success ? definitionResult.data : updated.fields
        }
      });
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err?.code === "P2002") {
        res.status(409).json({ success: false, message: "A form with this slug already exists" });
        return;
      }
      throw err;
    }

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
      select: { id: true, published: true, updatedAt: true },
    });


    res.json({ success: true, data: updated });
  },
);

// ============================================
// POST /api/v1/forms/generate — generate form with AI
// ============================================

export const generateForm: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { prompt } = req.body;

    // TODO: Connect real LLM logic here later. 
    // For now, return a basic mock structure so the frontend can test.
    const dummyDefinition = {
      version: "1.0",
      elements: [
        { id: "q1", type: "text", label: `AI generated question for: ${prompt || "General"}`, required: true }
      ]
    };

    res.json({ success: true, data: { definition: dummyDefinition } });
  }
);
