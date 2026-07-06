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
                price: price ?? 0,
                isPublic: isPublic ?? true,
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
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    },
);

// ============================================
// GET /api/v1/templates/:id — fetch template details
// Includes: template data, images, aggregated star rating, and paginated reviews
// Supports: ?page=1&limit=10 for review pagination
// ============================================

export const getTemplateById: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const templateId = req.params.id as string;
        const userId = res.locals.user?.id as string | undefined;

        // Extract review pagination params
        const page = Math.min(1000, Math.max(1, parseInt(req.query.page as string) || 1));
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
        const reviewSkip = (page - 1) * limit;

        // Fetch template, star aggregation, and viewer context in parallel
        // All queries only need templateId (from URL params), so none depend on each other
        const [template, starAggregation, ownership, existingReview] = await Promise.all([
            prisma.template.findUnique({
                where: { id: templateId },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true,
                        },
                    },
                    reviews: {
                        orderBy: { createdAt: "desc" },
                        skip: reviewSkip,
                        take: limit,
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    username: true,
                                    image: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.templateReview.aggregate({
                where: { templateId },
                _avg: { stars: true },
                _count: { stars: true },
            }),
            userId
                ? prisma.userOwnedTemplate.findUnique({
                      where: { userId_templateId: { userId, templateId } },
                  })
                : null,
            userId
                ? prisma.templateReview.findUnique({
                      where: { templateId_userId: { templateId, userId } },
                  })
                : null,
        ]);

        if (!template) {
            res.status(404).json({
                success: false,
                message: "Template not found",
            });
            return;
        }

        const isPurchased = !!ownership;
        const hasReviewed = !!existingReview;
        const totalReviews = starAggregation._count.stars;

        res.json({
            success: true,
            data: {
                ...template,
                stats: {
                    avgStars: starAggregation._avg.stars ?? 0,
                    reviewCount: totalReviews,
                    useCount: template.useCount,
                },
                viewer: {
                    isPurchased,
                    hasReviewed,
                    isOwner: userId ? template.userId === userId : false,
                },
                pagination: {
                    page,
                    limit,
                    total: totalReviews,
                    totalPages: Math.ceil(totalReviews / limit),
                },
            },
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
                            image: true,
                        },
                    },
                },
            }),
            prisma.template.count({ where: whereClause }),
        ]);

        // 4. Return paginated response
        res.json({
            success: true,
            data: templates,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    },
);

// ============================================
// POST /api/v1/templates/:id/purchase — purchase and clone a template
// Creates an independent Form owned by the buyer + a purchase record.
// The cloned Form does not depend on the original template for future edits.
// ============================================

export const purchaseTemplate: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = res.locals.user.id as string;
        const templateId = req.params.id as string;

        // 1. Fetch the full template (fields needed for cloning)
        const template = await prisma.template.findUnique({
            where: { id: templateId },
            select: {
                id: true,
                userId: true,
                title: true,
                description: true,
                fields: true,
                iconSymbol: true,
            },
        });

        if (!template) {
            res.status(404).json({
                success: false,
                message: "Template not found",
            });
            return;
        }

        // 2. Prevent purchasing own template
        if (template.userId === userId) {
            res.status(400).json({
                success: false,
                message: "You cannot purchase your own template",
            });
            return;
        }

        // 3. Clone template into a Form + create purchase record, atomically
        try {
            const result = await prisma.$transaction(async (tx) => {
                // Clone the template into an independent Form owned by the buyer
                const clonedForm = await tx.form.create({
                    data: {
                        title: template.title,
                        description: template.description,
                        iconSymbol: template.iconSymbol,
                        fields: template.fields ?? [],
                        userId,
                        // Cloned forms start unpublished so the buyer can customize first
                        published: false,
                    },
                });

                // Create ownership/purchase history record
                const purchase = await tx.userOwnedTemplate.create({
                    data: {
                        userId,
                        templateId,
                        clonedFormId: clonedForm.id,
                    },
                });

                // Increment useCount on the original template
                await tx.template.update({
                    where: { id: templateId },
                    data: { useCount: { increment: 1 } },
                });

                return { purchase, clonedForm };
            });

            res.status(201).json({
                success: true,
                message: "Template purchased successfully",
                data: {
                    purchase: result.purchase,
                    clonedForm: {
                        id: result.clonedForm.id,
                        title: result.clonedForm.title,
                    },
                },
            });
        } catch (error) {
            // Handle unique constraint violation (already purchased)
            if (
                error &&
                typeof error === "object" &&
                "code" in error &&
                error.code === "P2002"
            ) {
                res.status(409).json({
                    success: false,
                    message: "You have already purchased this template",
                });
                return;
            }
            throw error;
        }
    },
);

// ============================================
// POST /api/v1/templates/:id/reviews — submit a review
// Eligibility: user must have purchased the template, must not be the creator,
// and must not have already reviewed it.
// Schema supports future PATCH and DELETE via @@unique([templateId, userId]).
// ============================================

export const createReview: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = res.locals.user.id as string;
        const templateId = req.params.id as string;
        const { stars, text } = req.body;

        // 1. Verify template exists
        const template = await prisma.template.findUnique({
            where: { id: templateId },
            select: { id: true, userId: true },
        });

        if (!template) {
            res.status(404).json({
                success: false,
                message: "Template not found",
            });
            return;
        }

        // 2. Prevent reviewing own template
        if (template.userId === userId) {
            res.status(403).json({
                success: false,
                message: "You cannot review your own template",
            });
            return;
        }

        // 3. Verify user has purchased/used this template
        const ownership = await prisma.userOwnedTemplate.findUnique({
            where: {
                userId_templateId: { userId, templateId },
            },
        });

        if (!ownership) {
            res.status(403).json({
                success: false,
                message:
                    "You must purchase this template before leaving a review",
            });
            return;
        }

        // 4. Create the review (unique constraint prevents duplicate reviews)
        try {
            const review = await prisma.templateReview.create({
                data: {
                    stars,
                    text,
                    templateId,
                    userId,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true,
                        },
                    },
                },
            });

            res.status(201).json({
                success: true,
                data: review,
            });
        } catch (error) {
            // Handle unique constraint violation (already reviewed)
            if (
                error &&
                typeof error === "object" &&
                "code" in error &&
                error.code === "P2002"
            ) {
                res.status(409).json({
                    success: false,
                    message: "You have already reviewed this template",
                });
                return;
            }
            throw error;
        }
    },
);
