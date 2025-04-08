"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkLogin = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn"); // Or use token/session if available
      if (!isLoggedIn) {
        router.push("/login");
      }
      setLoading(false);
    };

    setTimeout(checkLogin, 100);
  }, [router]);

  // if (loading) {
  //   return (
  //     <p style={{ textAlign: "center", paddingTop: "2rem" }}>Loading...</p>
  //   );
  // }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Dashboard</h1>
      <p>Welcome! You&apos;re logged in.</p>
    </div>
  );
};

export default Dashboard;
