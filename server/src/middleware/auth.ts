import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loadEnv } from "../env";

loadEnv();

type AuthTokenPayload = {
  id: number;
  email: string;
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing token" });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({ error: "Server authentication is not configured" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.id !== "number" ||
      typeof decoded.email !== "string"
    ) {
      res.status(401).json({ error: "Unauthorized: Invalid token" });
      return;
    }

    req.user = decoded as AuthTokenPayload;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
