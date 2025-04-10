"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(
          "https://cr-backend-r0vn.onrender.com/api/session/verify",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (res.ok) {
          console.log("✅ Already logged in — redirecting to dashboard");
          router.replace("/dashboard");
        } else {
          console.log("🟡 No active session — stay on signup page");
          setCheckingSession(false);
        }
      } catch (err) {
        console.error("❌ Session check failed on signup page", err);
        setCheckingSession(false);
      }
    };

    checkSession();

    // 🔄 Listen for session sync across tabs
    const syncSession = (e) => {
      if (e.key === "session-updated") {
        console.log("🔁 Session updated in another tab — rechecking...");
        checkSession();
      }
    };

    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, [router]);

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-500 rounded-full animate-spin mb-3"></div>
          <p className="text-sm tracking-wide animate-fade-in-slow">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

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

      {/* Signup Form Container */}
      <div className="mt-10 p-4 w-full max-w-md bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold">Create an Account</h2>
      </div>

      <div className="mt-6"></div>

      <div className="p-6 w-full max-w-md bg-white rounded-lg shadow-md">
        <SignupForm />
      </div>
    </div>
  );
}

// Signup Form Component
const SignupForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value.trimStart() }));

    setErrors((prevErrors) => {
      let newErrors = { ...prevErrors };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@*.])[A-Za-z\d@*.]{8,16}$/;

    if (!formData.email?.trim() && !formData.phone?.trim()) {
      newErrors.identifier = "Email or phone is required.";
    }

    if (formData.email?.trim() && !emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (formData.phone?.trim() && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    if (!formData.password?.trim()) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be 8-16 characters with 1 uppercase, 1 digit, and 1 special character (@ * .)";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setAccountCreated(true);
          setTimeout(() => {
            router.replace("/login");
          }, 4000);
        } else {
          alert(data.message || "Signup failed.");
        }
      } catch (error) {
        console.error("Signup Error:", error);
        alert("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-green-500 rounded-full animate-ping-slow"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-green-500 rounded-full opacity-70 animate-ping-slow delay-150"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-green-500 rounded-full opacity-40 animate-ping-slow delay-300"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-green-500 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-green-600 text-sm tracking-wide animate-fade-in-slow">
          Creating your account securely...
        </p>
      </div>
    );
  }

  if (accountCreated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[240px] text-center">
        {/* Animated Checkmark Circle */}
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping-slow"></div>
          <div className="absolute inset-0 flex items-center justify-center bg-green-500 rounded-full text-white text-2xl shadow-lg">
            ✓
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-bold text-green-600 mb-1 animate-fade-in-slow">
          Welcome aboard!
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-sm max-w-xs animate-fade-in-slow delay-100">
          Your account has been created. You’re being redirected to login —
          where the real journey begins.
        </p>

        {/* Progress indicator */}
        <div className="w-full max-w-[200px] mt-6 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 animate-[loading-bar_3s_linear_infinite]" />
        </div>

        <style jsx>{`
          @keyframes loading-bar {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          .animate-[loading-bar_3s_linear_infinite] {
            animation: loading-bar 3s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <InputField
        id="phone"
        label="Phone Number"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
      />
      <InputField
        id="email"
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <InputField
        id="password"
        label="Create Password"
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
        className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 transition duration-300 transform hover:scale-[1.03] active:scale-[0.97]"
      >
        Sign Up
      </button>

      <div className="mt-[-14px] text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
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
