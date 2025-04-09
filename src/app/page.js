"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(
          "https://cr-backend-r0vn.onrender.com/api/session/verify",
          {
            method: "GET",
            credentials: "include", // Required to send cookies
          }
        );

        if (res.ok) {
          const data = await res.json();
          console.log("✅ Logged in as:", data.user?.email || "Unknown");
          router.push("/dashboard"); // Redirect if valid session
        } else {
          console.log("❌ No active session");
          setCheckingSession(false); // Show landing if not logged in
        }
      } catch (err) {
        console.error("Error verifying session:", err);
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  // ⏳ While checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-white text-sm">Checking session...</p>
      </div>
    );
  }

  // 🏡 Show landing page
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white font-[Open_Sans] bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600">
      {/* Logo */}
      <div className="absolute top-10">
        <Image
          src="/logo.png"
          alt="Code and Run Logo"
          width={200}
          height={70}
          priority
        />
      </div>

      {/* Welcome Message */}
      <div className="text-center">
        <h1 className="text-5xl font-semibold">Welcome to Code & Run</h1>
        <p className="text-2xl mt-2">Learn. Build. Grow.</p>

        {/* Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <Link href="/signup">
            <button className="w-48 px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition">
              Create Account
            </button>
          </Link>
          <Link href="/login">
            <button className="w-48 px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
