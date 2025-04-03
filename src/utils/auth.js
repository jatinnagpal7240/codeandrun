"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; // Use env variable

export async function getSession() {
  try {
    const token = cookies().get("authToken")?.value;
    if (!token) return null;

    // Verify JWT
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    return null; // Invalid or expired token
  }
}
