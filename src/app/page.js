// app/page.js
import { redirect } from "next/navigation";
import { getSession } from "./utils/auth"; // ✅ Make sure path is correct
import Landing from "./Landing"; // 👈 We will move your component here

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return <Landing />;
}
