import { Prisma } from "@prisma/client";
import { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../utils/async-handler";
import prisma from "../lib/db";

// ============================================
// POST /api/v1/templates — publish a form as a community template
// ============================================

export const createTemplate: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = res.locals.user.id as string;
        const {
            title,
            description,
            category,
            price,
            isPublic,
            iconSymbol,
            images,
            formId,
            fields,
        } = req.body;

        // Normalize direct fields input to store only the elements array
        let resolvedFields = fields ? fields.elements : undefined;
        let verifiedFormId: string | null = null;

        // When formId is provided, verify ownership and snapshot the fields
        if (formId) {
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
            verifiedFormId = formId;
        }

        const template = await prisma.template.create({
            data: {
                title,
                description,
                category,
                price: price || 0,
                isPublic: isPublic || true,
                iconSymbol,
                images: images ?? [],
                fields: resolvedFields,
                formId: verifiedFormId,
                userId,
            },
        });

        res.status(201).json({ success: true, data: template });
    },
);

// ============================================
// GET /api/v1/templates/owned — list user's owned templates
// ============================================

export const getOwnedTemplates: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = res.locals.user.id as string;

        // 1. Extract query params
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
        const search = req.query.search as string | undefined;
        const category = req.query.category as string | undefined;

        // 2. Build where clause
        const whereClause: Prisma.TemplateWhereInput = { userId };


        if (search) {
            whereClause.title = { contains: search, mode: "insensitive" };
        }

        if (category) {
            whereClause.category = category;
        }

        // 3. Fetch data and count in parallel
        const skip = (page - 1) * limit;

        const [templates, total] = await Promise.all([
            prisma.template.findMany({
                where: whereClause,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                    iconSymbol: true,
                    featured: true,
                    useCount: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma.template.count({ where: whereClause })
        ]);

        // 4. Return paginated response
        res.json({
            success: true,
            data: templates,
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
// GET /api/v1/templates/community — public front page
// ============================================

export const getCommunityTemplates: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        // 1. Extract query params
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
        const search = req.query.search as string | undefined;
        const category = req.query.category as string | undefined;

        // 2. Build where clause (ONLY public templates)
        const whereClause: Prisma.TemplateWhereInput = { isPublic: true };

        if (search) {
            whereClause.title = { contains: search, mode: "insensitive" };
        }
        if (category) {
            whereClause.category = category;
        }

        const skip = (page - 1) * limit;

        // 3. Fetch data and count in parallel
        const [templates, total] = await Promise.all([
            prisma.template.findMany({
                where: whereClause,
                orderBy: { useCount: "desc" }, // Sort by popularity!
                skip,
                take: limit,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                    iconSymbol: true,
                    featured: true,
                    useCount: true,
                    price: true,
                    isPublic: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true
                        }
                    }
                },
            }),
            prisma.template.count({ where: whereClause })
        ]);

        // 4. Return paginated response
        res.json({
            success: true,
            data: templates,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    },
);
