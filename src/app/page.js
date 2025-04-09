// app/page.js
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export default function Home() {
  const token = cookies().get("authToken")?.value;

  if (token) {
    try {
      jwt.verify(token, JWT_SECRET); // will throw if invalid
      redirect("/dashboard"); // ✅ Redirect if valid session
    } catch {
      // Invalid token → stay on landing page
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white font-[Open_Sans] bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600">
      <div className="absolute top-10">
        <img src="/logo.png" alt="Code and Run Logo" width={200} height={70} />
      </div>

      <div className="text-center">
        <h1 className="text-5xl font-semibold">Welcome to Code & Run</h1>
        <p className="text-2xl mt-2">Learn. Build. Grow.</p>

        <div className="mt-6 flex justify-center space-x-4">
          <a href="/signup">
            <button className="w-48 px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition">
              Create Account
            </button>
          </a>
          <a href="/login">
            <button className="w-48 px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition">
              Sign In
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
