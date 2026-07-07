import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { config } from "../lib/env";
import { asyncHandler } from "../utils/async-handler";
import { RequestHandler } from "express";

export const oauthCallback: RequestHandler = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const username =
    typeof session.user.username === "string"
      ? session.user.username.trim()
      : "";
  const destination = username.length === 0
    ? `${config.frontend.url}/onboarding`
    : `${config.frontend.url}/dashboard`;

  res.redirect(destination);
});
