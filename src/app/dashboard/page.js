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

    // 🔁 Listen for logout from other tabs
    const handleStorageChange = (event) => {
      if (event.key === "logoutEvent") {
        console.log("🚪 Logout detected in another tab — reloading...");
        window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch(
        "https://cr-backend-r0vn.onrender.com/api/session/logout",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.ok) {
        console.log("✅ Logged out successfully");

        // 🚀 Notify other tabs to sync logout
        localStorage.setItem("session-updated", Date.now());
        localStorage.setItem("logoutEvent", Date.now());

        router.push("/login");
      } else {
        alert("Logout failed. Try again.");
      }
    } catch (err) {
      console.error("❌ Logout error:", err);
      alert("Something went wrong.");
    }
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", paddingTop: "2rem" }}>Loading...</p>
    );
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Dashboard</h1>
      <p>Welcome! You&apos;re logged in.</p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "1.5rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#EF4444",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;
