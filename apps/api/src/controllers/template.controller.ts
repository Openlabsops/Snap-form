import { Prisma } from "@prisma/client";
import { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../utils/async-handler";
import prisma from "../lib/db";

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
