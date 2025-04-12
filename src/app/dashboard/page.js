"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
        if (!res.ok) router.push("/login");
        else {
          const data = await res.json();
          setUser(data.user);
          setLoading(false);
        }
      } catch (err) {
        router.push("/login");
      }
    };
    verifySession();

    const handleStorageChange = (event) => {
      if (event.key === "logoutEvent") window.location.reload();
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
        localStorage.setItem("session-updated", Date.now());
        localStorage.setItem("logoutEvent", Date.now());
        router.push("/login");
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  const renderAvatar = () => {
    if (user?.photo) {
      return (
        <img
          src={user.photo}
          alt="User"
          className="w-12 h-12 rounded-full object-cover shadow"
        />
      );
    } else if (user?.name) {
      return (
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold text-white shadow">
          {user.name.charAt(0).toUpperCase()}
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 shadow">
          <User className="w-6 h-6" />
        </div>
      );
    }
  };

  if (loading) {
    return (
      <p className="text-center pt-8 text-gray-500">
        Loading your dashboard...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-8">
      {/* Top Nav */}
      <div className="flex justify-end items-center max-w-7xl mx-auto">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="focus:outline-none"
          >
            {renderAvatar()}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-72 backdrop-blur-xl bg-white/70 rounded-2xl shadow-2xl border p-5 z-50 animate-fade-in">
              <div className="flex flex-col items-center">
                {renderAvatar()}
                <h3 className="mt-3 text-lg font-bold text-gray-800">
                  {user?.name || "User"}
                </h3>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>

              <div className="mt-5 space-y-3">
                <button className="w-full py-2 text-sm font-medium text-blue-600 border border-blue-500 rounded-lg hover:bg-blue-50 transition">
                  Manage your CR Account
                </button>
                <button className="w-full py-2 text-sm font-medium text-gray-700 border rounded-lg hover:bg-gray-50 transition">
                  Add another Account
                </button>
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full py-2 text-sm font-medium text-green-600 border border-green-500 rounded-lg hover:bg-green-50 transition"
                >
                  Update your Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-sm font-medium text-red-600 border border-red-500 rounded-lg hover:bg-red-50 transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Card */}
      <div className="mt-16 max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10 text-center">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
          Welcome back, {user?.name || "User"}!
        </h2>
        <p className="text-gray-600 text-lg">
          Your personal CR Dashboard is ready.
        </p>
        <div className="mt-6 text-sm text-gray-500">
          ✨ More features coming soon — stay tuned!
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
