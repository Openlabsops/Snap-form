import { Request, Response, NextFunction, RequestHandler } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { asyncHandler } from "../utils/async-handler";

export const requireAuth: RequestHandler = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  res.locals.user = session.user;
  res.locals.session = session.session;

  next();
});
