"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // Prevent SSR mismatch

  return (
    <div className="w-full flex flex-col items-center bg-white text-gray-800 min-h-screen">
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

      {/* Signup Form */}
      <div className="mt-10 p-6 w-full max-w-md bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center">
          Create an Account
        </h2>
      </div>

      <div className="mt-6 p-6 w-full max-w-md bg-white rounded-lg shadow-md">
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
  const [otpSent, setOtpSent] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  const [otpEmail, setOtpEmail] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value.trimStart() }));
    setErrors((prevErrors) => {
      let newErrors = { ...prevErrors };
      delete newErrors[id]; // Clear error when user types
      return newErrors;
    });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrors({});

    let newErrors = {};
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|in|co|io|tech)$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@*.])[A-Za-z\d@*.]{8,16}$/;

    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email.";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit number.";

    if (!formData.password.trim()) newErrors.password = "Password is required.";
    else if (!passwordRegex.test(formData.password))
      newErrors.password =
        "Password must be 8-16 chars with 1 uppercase, 1 digit, 1 special (@ * .)";

    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) return;

    try {
      // Check if the user already exists
      const checkResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/check-user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            phone: formData.phone,
          }),
        }
      );

      const checkData = await checkResponse.json();
      if (checkData.exists) {
        alert("User already exists. Try logging in.");
        return;
      }

      // Send OTP
      const otpResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            phone: formData.phone,
          }),
        }
      );

      const otpData = await otpResponse.json();
      if (!otpResponse.ok) {
        alert(otpData.message || "Failed to send OTP.");
        return;
      }

      alert("OTP sent successfully!");
      setOtpSent(true);
      setOtpPhone("");
      setOtpEmail("");
    } catch (error) {
      console.error("OTP Send Error:", error);
      alert("Failed to send OTP. Try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otpPhone || !otpEmail) {
      alert("Please enter OTPs.");
      return;
    }

    try {
      const verifyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            otpEmail,
            otpPhone,
          }),
        }
      );

      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) {
        alert(verifyData.message || "OTP verification failed.");
        return;
      }

      alert("Signup successful!");
      router.push("/dashboard");
    } catch (error) {
      console.error("OTP Verification Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form className="space-y-6">
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

      {!otpSent ? (
        <button
          onClick={handleSendOtp}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 transition duration-300 transform hover:scale-[1.03] active:scale-[0.97]"
        >
          Send OTP
        </button>
      ) : (
        <>
          <InputField
            id="otpPhone"
            label="Enter Phone OTP"
            value={otpPhone}
            onChange={(e) => setOtpPhone(e.target.value)}
            error={errors.otpPhone}
          />
          <InputField
            id="otpEmail"
            label="Enter Email OTP"
            value={otpEmail}
            onChange={(e) => setOtpEmail(e.target.value)}
            error={errors.otpEmail}
          />
          <button className="btn-success" onClick={handleVerifyOtp}>
            Verify OTP & Signup
          </button>
        </>
      )}
    </form>
  );
};

const InputField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
}) => (
  <div className="relative w-full">
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
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
