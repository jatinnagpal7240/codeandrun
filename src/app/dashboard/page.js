"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch(
          "https://cr-backend-r0vn.onrender.com/api/session/verify",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          console.log("⛔ No session — redirecting to login");
          router.push("/login");
        } else {
          console.log("✅ Session verified — stay on dashboard");
          setLoading(false);
        }
      } catch (err) {
        console.error("❌ Session check failed on dashboard:", err);
        router.push("/login");
      }
    };

    verifySession();
  }, [router]);

  if (loading) {
    return (
      <p style={{ textAlign: "center", paddingTop: "2rem" }}>Loading...</p>
    );
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Dashboard</h1>
      <p>Welcome! You&apos;re logged in.</p>
    </div>
  );
};

export default Dashboard;
