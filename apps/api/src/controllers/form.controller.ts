import { Prisma } from "@repo/db";
import { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../utils/async-handler";
import { FormDefinitionSchema } from "@repo/types";
import { CreateFormInput, UpdateFormInput } from "../lib/form-schemas";
import prisma from "../lib/db";
import { formatZodErrors } from "@/middleware/validate";

// ============================================
// GET /api/v1/forms — list user's forms
// ============================================

export const listForms: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user.id as string;

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const search = req.query.search as string | undefined;
    const published = req.query.published as string | undefined;
    const whereClause: Prisma.FormWhereInput = { userId };

    if (search) {
      whereClause.title = { contains: search, mode: "insensitive" };
    }

    if (published !== undefined) {
      whereClause.published = published === "true";
    }
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
          fields: definition,
        },
        select: {
          id: true, title: true, description: true, iconSymbol: true,
          coverUrl: true, published: true, slug: true, type: true,
          requireEmail: true, responseCount: true, viewCount: true,
          fields: true, createdAt: true, updatedAt: true, userId: true,
        },
      });
      const definitionResult = FormDefinitionSchema.safeParse(form.fields);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { fields: _fields, ...formWithoutFields } = form;
      res.status(201).json({
        success: true, data: { ...formWithoutFields, definition: definitionResult.success ? definitionResult.data : form.fields }
      });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
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
        fields: true,
        createdAt: true, updatedAt: true, userId: true,
      },
    });


    if (!form) {
      res.status(404).json({ success: false, message: "Form not found" });
      return;
    }

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

    const { title, description, coverUrl, iconSymbol, requireEmail, slug, type, definition: rawDefinition } = req.body as UpdateFormInput;

    let definition = rawDefinition;

    if (definition !== undefined) {
      const parsed = FormDefinitionSchema.safeParse(definition);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: formatZodErrors(parsed.error),
        });
        return;
      }
      definition = parsed.data;
    }

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
          fields: true, createdAt: true, updatedAt: true, userId: true,
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
      if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
        res.status(409).json({ success: false, message: "A form with this slug already exists" });
        return;
      }
      if (err && typeof err === "object" && "code" in err && err.code === "P2025") {
        res.status(404).json({ success: false, message: "Form not found" });
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

// ============================================
// GET /api/v1/forms/:id/analytics
// ============================================

export const getAnalytics: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user.id as string;

    const form = await prisma.form.findFirst({
      where: { id: req.params.id, userId },
      select: { id: true, viewCount: true, responseCount: true },
    });

    if (!form) {
      res.status(404).json({ success: false, message: "Form not found" });
      return;
    }

    const recentResponses = await prisma.response.findMany({
      where: { formId: form.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, email: true, createdAt: true },
    });

    res.json({
      success: true,
      data: {
        viewCount: form.viewCount,
        responseCount: form.responseCount,
        recentResponses,
      },
    });
  },
);

// ============================================
// POST /api/v1/forms/:id/integrations/google-sheets
// ============================================

export const setupGoogleSheets: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user.id as string;
    const { accessToken, refreshToken, spreadsheetId, spreadsheetUrl } = req.body;

    const form = await prisma.form.findFirst({
      where: { id: req.params.id, userId },
      select: { id: true },
    });

    if (!form) {
      res.status(404).json({ success: false, message: "Form not found" });
      return;
    }

    const [integration] = await prisma.$transaction([
      prisma.formIntegration.upsert({
        where: { formId_provider: { formId: form.id, provider: "GOOGLE_SHEETS" } },
        update: { accessToken, refreshToken, spreadsheetId, spreadsheetUrl },
        create: { formId: form.id, provider: "GOOGLE_SHEETS", accessToken, refreshToken, spreadsheetId, spreadsheetUrl },
      }),
      prisma.form.update({
        where: { id: form.id },
        data: { googleSheetId: spreadsheetId, googleSheetUrl: spreadsheetUrl },
      }),
    ]);

    res.json({
      success: true,
      data:
      {
        id: integration.id,
        formId: integration.formId,
        provider: integration.provider,
        spreadsheetId: integration.spreadsheetId,
        spreadsheetUrl: integration.spreadsheetUrl,
        createdAt: integration.createdAt
      }
    });
  },
);

// ============================================
// DELETE /api/v1/forms/:id/integrations/google-sheets
// ============================================

export const disconnectGoogleSheets: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user.id as string;

    const form = await prisma.form.findFirst({
      where: { id: req.params.id, userId },
      select: { id: true },
    });

    if (!form) {
      res.status(404).json({ success: false, message: "Form not found" });
      return;
    }

    try {
      await prisma.formIntegration.delete({
        where: { formId_provider: { formId: form.id, provider: "GOOGLE_SHEETS" } },
      });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err && err.code === "P2025") {
        res.status(404).json({ success: false, message: "No Google Sheets integration found" });
        return;
      }
      throw err;
    }


    await prisma.form.update({
      where: { id: form.id },
      data: { googleSheetId: null, googleSheetUrl: null },
    });

    res.json({ success: true, message: "Google Sheets integration removed" });
  },
);


// ============================================
// GET /api/v1/forms/:id/responses/export/csv
// ============================================


// Escape a CSV cell: wrap in quotes, escape internal quotes, prevent formula injection
const escapeCell = (val: unknown): string => {
  const str = String(val ?? "");
  const safe = str.startsWith("=") || str.startsWith("+") || str.startsWith("-") || str.startsWith("@")
    ? `'${str}` : str;
  return `"${safe.replace(/"/g, '""')}"`;
};


export const exportCsv: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user.id as string;

    const form = await prisma.form.findFirst({
      where: { id: req.params.id, userId },
      select: { id: true, title: true, slug: true, fields: true },
    });

    if (!form) {
      res.status(404).json({ success: false, message: "Form not found" });
      return;
    }

    const definition = FormDefinitionSchema.safeParse(form.fields);
    const fieldLabels: { id: string; label: string }[] = definition.success
      ? definition.data.elements.map((el: { id: string; label: string; }) => ({ id: el.id, label: el.label }))
      : [];

    const responses = await prisma.response.findMany({
      where: { formId: form.id },
      orderBy: { createdAt: "asc" },
      select: { id: true, email: true, data: true, createdAt: true },
    });

    const staticHeaders = [escapeCell("id"), escapeCell("email"), escapeCell("submittedAt")];
    const fieldHeaders = fieldLabels.map((f) => escapeCell(f.label));
    const header = [...staticHeaders, ...fieldHeaders].join(",");

    const rows = responses.map((r) => {
      const data = r.data as Record<string, unknown>;
      const fieldValues = fieldLabels.map((f) => escapeCell(data[f.id]));
      return [escapeCell(r.id), escapeCell(r.email ?? ""), escapeCell(r.createdAt.toISOString()), ...fieldValues].join(",");
    });

    const csv = [header, ...rows].join("\n");
    const filename = form.slug ?? form.id;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="form-${filename}-responses.csv"`);
    res.send(csv);
  },
);