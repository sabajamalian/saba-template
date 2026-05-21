import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { config } from "../config.js";

export interface AuthUserPayload extends JwtPayload {
  sub: string;
  email: string;
  role: "user" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

const isAuthUserPayload = (value: string | JwtPayload): value is AuthUserPayload => {
  return typeof value !== "string" && typeof value.sub === "string" && typeof value.email === "string" && (value.role === "user" || value.role === "admin");
};

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    if (!isAuthUserPayload(decoded)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};
