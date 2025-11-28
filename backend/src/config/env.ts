import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET || "devsecret";
export const EMAIL_USER = process.env.EMAIL_USER || "0";
export const EMAIL_PASS = process.env.EMAIL_PASS || "0";
