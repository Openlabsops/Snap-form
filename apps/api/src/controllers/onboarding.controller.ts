import { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../utils/async-handler";
import { OnboardingSchema } from "../lib/user-schemas";
import prisma from "../lib/db";

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

    const { username, xUrl, linkedinUrl, instagramUrl } = parsed.data;

    // Check if username is already taken by another user
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== user.id) {
      res.status(409).json({
        success: false,
        message: "Username is already taken",
      });
      return;
    }

    // Save onboarding data
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        username,
        xUrl: xUrl || null,
        linkedinUrl: linkedinUrl || null,
        instagramUrl: instagramUrl || null,
        onboardingCompleted: true,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        xUrl: true,
        linkedinUrl: true,
        instagramUrl: true,
        onboardingCompleted: true,
      },
    });

    res.status(200).json({ success: true, user: updated });
  }
);
