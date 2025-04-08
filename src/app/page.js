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
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/session/verify`,
          {
            method: "GET",
            credentials: "include", // Important: sends cookies
          }
        );

        if (res.ok) {
          const data = await res.json();
          console.log("✅ Session found for:", data.user);
          router.push("/dashboard");
        } else {
          console.log("⚠️ No session found.");
          setCheckingSession(false);
        }
      } catch (err) {
        console.error("❌ Error checking session:", err);
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-800">
        <div className="text-center">
          <div className="loader border-4 border-emerald-500 border-t-transparent w-12 h-12 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-emerald-600 text-sm">Checking session...</p>
        </div>
      </div>
    );
  }

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
