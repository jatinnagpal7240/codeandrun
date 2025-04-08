"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Loading state added
  const router = useRouter();

  useEffect(() => {
    const checkLogin = () => {
      const storedUserId = localStorage.getItem("userId");

      if (!storedUserId) {
        router.push("/login");
      } else {
        setUserId(storedUserId);
      }

      setLoading(false); // ✅ Done checking
    };

    // Wait briefly to ensure localStorage is ready
    setTimeout(checkLogin, 400); // or try 200ms if needed
  }, [router]);

  if (loading) {
    return (
      <p style={{ textAlign: "center", paddingTop: "2rem" }}>Loading...</p>
    ); // ✅ Smooth transition
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Dashboard</h1>
      {userId ? (
        <p>
          Welcome! Your user ID is: <strong>{userId}</strong>
        </p>
      ) : (
        <p>Redirecting to login...</p>
      )}
    </div>
  );
};

export default Dashboard;
