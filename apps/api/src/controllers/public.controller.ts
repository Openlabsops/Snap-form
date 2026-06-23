import { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../utils/async-handler";
import { FormDefinitionSchema } from "@repo/types";
import prisma from "../lib/db";

// ============================================
// GET /api/v1/public/forms/:slug
// No auth required — used by the public form fill page.
// Only returns published forms, looked up by slug.
// ============================================

export const getPublicForm: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;

    const form = await prisma.form.findFirst({
      where: { slug, published: true },
      select: {
        id: true,
        title: true,
        description: true,
        coverUrl: true,
        iconSymbol: true,
        requireEmail: true,
        fields: true,   // the FormDefinition JSON
        viewCount: true,
      },
    });

    if (!form) {
      res.status(404).json({ success: false, message: "Form not found" });
      return;
    }

    // Validate the definition coming out of the DB before sending
    const definitionResult = FormDefinitionSchema.safeParse(form.fields);
    if (!definitionResult.success) {
      console.error("Corrupt form definition for slug:", slug, definitionResult.error);
      res.status(500).json({ success: false, message: "Form is currently unavailable" });
      return;
    }

    // Increment view count in the background — don't await, not critical
    prisma.form
      .update({ where: { id: form.id }, data: { viewCount: { increment: 1 } } })
      .catch((err: unknown) => console.error("Failed to increment viewCount:", err));

    res.json({
      success: true,
      data: {
        id: form.id,
        title: form.title,
        description: form.description,
        coverUrl: form.coverUrl,
        iconSymbol: form.iconSymbol,
        requireEmail: form.requireEmail,
        definition: definitionResult.data,
      },
    });
  },
);
