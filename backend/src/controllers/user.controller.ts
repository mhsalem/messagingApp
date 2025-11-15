import { Request, Response } from "express";
import prisma from "../db";
import bcrypt from "bcryptjs";


export const register = async (req: Request, res: Response) => {
  try {
    const password = String(req.body.password);
    const phone = String(req.body.phone);
    const username = String(req.body.username);
    const hashed = await bcrypt.hash(password, 10);
    if (!password || !phone || !username) {
      return res.status(400).json({ error: "Missing data" });
    }
    const user = await prisma.user.create({
      data: { password:hashed, phone, username },
    });
    res.status(201).json({
      user,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error });
  }
};

export const login = async (req: Request, res: Response) => {};
