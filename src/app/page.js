// src/app/page.js
import { redirect } from "next/navigation";
import { getSession } from "../utils/auth"; // ✅ Correct path
import Landing from "./Landing";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return <Landing />;
}
