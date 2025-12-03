import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../db";

const JWT_SECRET = String(process.env.JWT_SECRET || "");

interface TokenPayload {
  userId?: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = String(req.headers.authorization || "");
    if (!header) return res.status(401).json({ message: "Missing Authorization header" });

    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
      return res.status(401).json({ message: "Invalid Authorization format. Use: Bearer <token>" });
    }

    const token = parts[1];
    let payload: TokenPayload;
    try {
      payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (!payload?.userId) return res.status(401).json({ message: "Token missing userId" });

    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, },
    });
    if (!user) return res.status(401).json({ message: "User not found" });

    (req as any).user = { userId: user.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token", details: err });
  }
};
