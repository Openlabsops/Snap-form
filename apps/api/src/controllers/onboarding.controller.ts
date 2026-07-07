import { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../utils/async-handler";
import { OnboardingSchema } from "../lib/user-schemas";
import prisma from "../lib/db";
import { isPrismaErrorCode } from "@/utils/prisma";

export const completeOnboarding: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = res.locals.user;

    // Validate request body
    const parsed = OnboardingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { username, socialLinks } = parsed.data;

    // Normalise empty strings to undefined so they aren't stored
    const cleanedLinks = {
      x: socialLinks.x || undefined,
      linkedin: socialLinks.linkedin || undefined,
      instagram: socialLinks.instagram || undefined,
    };

    try {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          username,
          socialLinks: cleanedLinks,
          onboardingCompleted: true,
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          socialLinks: true,
          onboardingCompleted: true,
        },
      });

      res.status(200).json({ success: true, user: updated });
    } catch (error) {
      // Unique constraint on username — can happen under concurrent requests
      if (isPrismaErrorCode(error, "P2002")) {
        res.status(409).json({ success: false, message: "Username is already taken" });
        return;
      }
      throw error;
    }
  }
);
