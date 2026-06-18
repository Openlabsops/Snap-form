import { Request, Response, RequestHandler } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
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
