"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent SSR mismatch

  return (
    <div className="w-full flex flex-col items-center bg-gray-50 text-gray-800 min-h-screen">
      {/* Header with Logo */}
      <header className="fixed top-0 left-0 w-full flex items-center p-4 bg-white z-50 shadow-md">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Code and Run Logo"
            width={150}
            height={50}
            priority
          />
        </Link>
      </header>

      {/* Spacer for Fixed Header */}
      <div className="pt-[80px]"></div>

      {/* Login Form Container */}
      <div className="mt-10 p-4 w-full max-w-md bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold">Sign In</h2>
      </div>

      <div className="mt-6"></div>

      <div className="p-6 w-full max-w-md bg-white rounded-lg shadow-md">
        <LoginForm />
      </div>
    </div>
  );
}

// Login Form Component
const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value.trimStart() }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (!formData.identifier.trim()) {
      newErrors.identifier = "Enter an email or phone number.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Enter your password.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true); // ✅ Start loading

      try {
        console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            credentials: "include", // 👈 Essential for sending/receiving cookies
          }
        );

        const contentType = response.headers.get("Content-Type");

        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Invalid response (not JSON):", text);
          alert("Unexpected server response. Please try again.");
          return;
        }

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("isLoggedIn", "true");
          router.push("/dashboard");
        } else {
          alert(data.message || "Login failed.");
        }
      } catch (err) {
        console.error("Login Error:", err);
        alert("Something went wrong. Please try again.");
      } finally {
        setLoading(false); // ✅ Stop loading
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-ping-slow"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full opacity-70 animate-ping-slow delay-150"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full opacity-40 animate-ping-slow delay-300"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-blue-600 text-sm tracking-wide animate-fade-in-slow">
          Logging you in securely...
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <InputField
        id="identifier"
        label="Email or Phone"
        value={formData.identifier}
        onChange={handleChange}
        error={errors.identifier}
      />
      <InputField
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />

      <div className="flex items-center mt-2">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          className="w-4 h-4 cursor-pointer"
          id="showPassword"
        />
        <label
          htmlFor="showPassword"
          className="ml-2 text-gray-600 text-sm cursor-pointer"
        >
          Show Password
        </label>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-300 transform hover:scale-[1.03] active:scale-[0.97]"
      >
        Log In
      </button>

      {/* 👇 Add this text with very minimal spacing */}
      <div className="mt-[-14px] text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Create one
        </Link>
      </div>
    </form>
  );
};

const InputField = ({ id, label, type = "text", value, onChange, error }) => (
  <div className="relative w-full">
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      className={`peer w-full px-4 pt-5 pb-2 border ${
        error ? "border-red-500" : "border-gray-400"
      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
      placeholder=" "
    />
    <label
      htmlFor={id}
      className={`absolute left-3 px-1 bg-white text-gray-500 text-sm transition-all ${
        value ? "top-[-10px] text-sm text-blue-500 px-1" : "top-4 text-base"
      } peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-blue-500 peer-focus:px-1`}
    >
      {label}
    </label>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
