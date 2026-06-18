import { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

export const registerUser = async (req: Request, res: Response) => {
  const response = await auth.api.signUpEmail({
    body: {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
    },
    headers: fromNodeHeaders(req.headers),
    asResponse: true, 
  });

  // Copy all headers (including Set-Cookie) from better-auth's response to Express
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const data = await response.json();
  res.status(response.status).json(data);
};

export const loginUser = async (req: Request, res: Response) => {
  const response = await auth.api.signInEmail({
    body: {
      email: req.body.email,
      password: req.body.password,
    },
    headers: fromNodeHeaders(req.headers),
    asResponse: true,
  });

  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const data = await response.json();
  res.status(response.status).json(data);
};

export const logoutUser = async (req: Request, res: Response) => {
  const response = await auth.api.signOut({
    headers: fromNodeHeaders(req.headers), 
    asResponse: true,
  });

  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const data = await response.json();
  res.status(response.status).json(data);
};
