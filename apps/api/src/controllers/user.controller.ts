import { Request, Response, RequestHandler } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import prisma from "../lib/db";
import { CheckUsernameQuerySchema } from "../lib/user-schemas";
import { asyncHandler } from "../utils/async-handler";


const forwardHeaders = (webResponse: globalThis.Response, res: Response) => {
  const setCookies = webResponse.headers.getSetCookie();
  if (setCookies.length) {
    res.setHeader("Set-Cookie", setCookies);
  }
  webResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") {
      res.setHeader(key, value);
    }
  });
};

export const registerUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const webResponse = await auth.api.signUpEmail({
    body: {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
    },
    headers: fromNodeHeaders(req.headers),
    asResponse: true,
  }) as unknown as globalThis.Response;

  forwardHeaders(webResponse, res);
  const data = await webResponse.json();
  res.status(webResponse.status).json(data);
});

export const loginUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const webResponse = await auth.api.signInEmail({
    body: {
      email: req.body.email,
      password: req.body.password,
    },
    headers: fromNodeHeaders(req.headers),
    asResponse: true,
  }) as unknown as globalThis.Response;

  forwardHeaders(webResponse, res);
  const data = await webResponse.json();
  res.status(webResponse.status).json(data);
});

export const logoutUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const webResponse = await auth.api.signOut({
    headers: fromNodeHeaders(req.headers),
    asResponse: true,
  }) as unknown as globalThis.Response;

  forwardHeaders(webResponse, res);
  const data = await webResponse.json();
  res.status(webResponse.status).json(data);
});

export const getUserProfile: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionUser = res.locals.user;
    if (!sessionUser?.id) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        emailVerified: true,
        role: true,
        plan: true,
        onboardingCompleted: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, user });
  }
);

export const checkUsernameAvailability: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const rawUsername =
      (req.query.username as string | undefined) ??
      (req.params.username as string | undefined) ??
      "";
    const username = rawUsername.trim().toLowerCase();

    const parsed = CheckUsernameQuerySchema.safeParse({ username });
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        available: false,
        isAvailable: false,
        message:
          parsed.error.issues[0]?.message ??
          "Username must be 3–30 characters, lowercase letters, numbers, and underscores only",
      });
      return;
    }

    // Reserved usernames that cannot be claimed
    const reservedUsernames = [
      "admin",
      "administrator",
      "root",
      "system",
      "snapform",
      "snap-form",
      "api",
      "test",
    ];
    if (reservedUsernames.includes(username)) {
      res.status(200).json({
        success: true,
        available: false,
        isAvailable: false,
        message: "Username is already taken",
      });
      return;
    }

    // Attempt to extract session user if present
    let currentUserId: string | undefined = res.locals.user?.id;
    if (!currentUserId) {
      try {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });
        if (session?.user?.id) {
          currentUserId = session.user.id;
        }
      } catch {
        // Unauthenticated request is allowed for username check
      }
    }

    const existing = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: { id: true },
    });

    const isAvailable =
      !existing || (!!currentUserId && existing.id === currentUserId);

    res.status(200).json({
      success: true,
      available: isAvailable,
      isAvailable,
      message: isAvailable ? "Username is available" : "Username is already taken",
    });
  }
);

