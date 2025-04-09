"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; // Use env variable

export async function getSession() {
  try {
    const token = cookies().get("authToken")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, SECRET_KEY); // Verifies and decodes JWT
    return decoded; // Return user data (typically includes user ID, etc.)
  } catch (error) {
    return null;
  }
}
