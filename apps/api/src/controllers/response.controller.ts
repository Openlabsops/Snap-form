import { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../utils/async-handler";
import prisma from "../lib/db";
import { Prisma } from "@prisma/client";
import { SubmitResponseInput } from "../lib/form-schemas";

// ============================================
// POST /api/v1/forms/:id/responses
// Public — no auth required (called by form respondents)
// Body pre-validated by validate(SubmitResponseSchema)
// ============================================

export const submitResponse: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: formId } = req.params;
    const { email, data } = req.body as SubmitResponseInput;

    if (!formId) {
      res.status(400).json({ success: false, message: "Form ID is required" });
      return;
    }

    // Only allow submissions to published forms
    const form = await prisma.form.findFirst({
      where: { id: formId, published: true },
      select: {
        id: true,
        requireEmail: true,
        responseCount: true,
      },
    });

    if (!form) {
      res
        .status(404)
        .json({ success: false, message: "Form not found or not published" });
      return;
    }

    if (form.requireEmail && !email) {
      res
        .status(400)
        .json({ success: false, message: "Email is required for this form" });
      return;
    }

    // Capture request metadata for analytics
    const ipAddress =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
      req.socket.remoteAddress ??
      null;
    const userAgent = req.headers["user-agent"] ?? null;
    const referrer = req.headers["referer"] ?? null;

    const [response] = await prisma.$transaction([
      prisma.response.create({
        data: {
          formId,
          email: email ?? null,
          data: data as unknown as Prisma.InputJsonValue,
          ipAddress,
          userAgent,
          referrer,
        },
      }),
      // Increment the response counter atomically
      prisma.form.update({
        where: { id: formId },
        data: { responseCount: { increment: 1 } },
      }),
    ]);

    res.status(201).json({
      success: true,
      message: "Response recorded",
      data: { id: response.id },
    });
  },
);

// ============================================
// GET /api/v1/forms/:id/responses
// Private — only the form owner can see responses
// ============================================

export const listResponses: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user.id as string;
    const { id: formId } = req.params;

    // Verify ownership
    const form = await prisma.form.findFirst({
      where: { id: formId, userId },
      select: { id: true },
    });

    if (!form) {
      res.status(404).json({ success: false, message: "Form not found" });
      return;
    }

    const page = Math.max(1, Number(req.query["page"] ?? 1));
    const limit = Math.min(100, Math.max(1, Number(req.query["limit"] ?? 50)));
    const skip = (page - 1) * limit;

    const [responses, total] = await prisma.$transaction([
      prisma.response.findMany({
        where: { formId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.response.count({ where: { formId } }),
    ]);

    res.json({
      success: true,
      data: responses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  },
);
