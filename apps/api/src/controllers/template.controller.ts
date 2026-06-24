import { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import prisma from "../lib/db.js";

// POST /api/v1/templates
export const createTemplate: RequestHandler = asyncHandler(
	async (req: Request, res: Response) => {
		const userId = res.locals.user.id as string;
		const {
			title,
			description,
			category,
			iconSymbol,
			images,
			formId,
			fields,
			status,
		} = req.body;

		let resolvedFields = fields ?? [];

		if (!fields && formId) {
			const sourceForm = await prisma.form.findFirst({
				where: { id: formId, userId },
				select: { fields: true },
			});

			if (!sourceForm) {
				res.status(404).json({
					success: false,
					message: "Source form not found or does not belong to you",
				});
				return;
			}

			resolvedFields = sourceForm.fields;
		}

		const template = await prisma.template.create({
			data: {
				title,
				description,
				category,
				iconSymbol,
				images: images ?? [],
				fields: resolvedFields,
				formId: formId ?? null,
				status: status ?? "PUBLISHED",
				createdById: userId,
			},
		});

		res.status(201).json({ success: true, data: template });
	}
);

// GET /api/v1/template

export const listTemplates: RequestHandler = asyncHandler(
	async (req: Request, res: Response) => {
		const { category } = req.query;

		const where: Record<string, unknown> = { status: "PUBLISHED" };
		if (typeof category === "string" && category.length > 0) {
			where.category = category;
		}

		const templates = await prisma.template.findMany({
			where,
			orderBy: [
				{ featured: "desc" },
				{ useCount: "desc" },
				{ createdAt: "desc" },
			],
			select: {
				id: true,
				title: true,
				description: true,
				category: true,
				iconSymbol: true,
				images: true,
				featured: true,
				useCount: true,
				createdAt: true,
				createdBy: {
					select: {
						id: true,
						name: true,
						image: true,
					},
				},
			},
		});

		res.json({ success: true, data: templates });
	}
);
