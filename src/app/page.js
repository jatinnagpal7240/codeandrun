"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();
  const [showShadow, setShowShadow] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [text, setText] = useState("");
  const [showSetupText, setShowSetupText] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const fullText = "Welcome to Code & Run - Updated again".trim();

  useEffect(() => {
    const handleScroll = () => {
      setShowShadow(window.scrollY > 1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let index = 0;
    let tempArray = [];

    const interval = setInterval(() => {
      if (index < fullText.length) {
        tempArray.push(fullText[index]);
        setText(tempArray.join(""));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowSetupText(true);
          setFadeIn(true); // Trigger fade-in effect
        }, 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white font-[Open_Sans]">
      {/* Welcome Section with Gradient */}
      {!showSignup && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 z-50">
          <div className="absolute top-10">
            <Image
              src="/logo.png"
              alt="Code and Run Logo"
              width={200}
              height={70}
              priority
            />
          </div>

          {/* ✅ Wrapper with Fixed Height to Prevent Movement */}
          <div className="relative text-center">
            <h1 className="text-5xl text-white font-semibold text-gray-800">
              {text}
              <span className="blinking-cursor">|</span>
            </h1>

            {/* ✅ Fade-in Text & Button */}
            <div className="relative w-full h-[70px]">
              {showSetupText && (
                <p
                  className={`text-2xl text-white absolute left-1/2 -translate-x-1/2 top-4 transition-opacity duration-1000 ${
                    fadeIn ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Let&apos;s set it up for you!
                </p>
              )}

              {showSetupText && (
                <button
                  className={`absolute top-16 right-0 bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 opacity-0 ${
                    fadeIn ? "opacity-100 transition-opacity duration-1000" : ""
                  }`}
                  onClick={() => setShowSignup(true)}
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Signup Form (Appears after clicking the button) */}
      {showSignup && (
        <div className="w-full flex flex-col items-center transition-opacity duration-500 bg-white text-gray-800">
          <header
            className={`fixed top-0 left-0 w-full flex items-center p-4 bg-white z-50 transition-shadow duration-300 ${
              showShadow ? "shadow-md" : "shadow-none"
            }`}
          >
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

          <div className="pt-[80px]"></div>

          <div className="mt-10 p-6 w-full max-w-md bg-white rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold">Create an Account</h2>
          </div>

          <div className="mt-6"></div>

          <div className="p-6 w-full max-w-md bg-white rounded-lg shadow-md">
            <SignupForm />
          </div>
        </div>
      )}
    </div>
  );
}

// Signup Form Component
const SignupForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value.trimStart() }));

    setErrors((prevErrors) => {
      let newErrors = { ...prevErrors };
      if (id === "confirmPassword") {
        newErrors.confirmPassword =
          formData.password !== value ? "Passwords do not match." : "";
      } else {
        delete newErrors[id];
      }
      return newErrors;
    });
  };

  const handleNextStep = () => {
    let newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted successfully!", formData);
    router.push("/dashboard");
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {step === 1 && (
        <>
          <InputField
            id="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <InputField
            id="lastName"
            label="Last Name (optional)"
            value={formData.lastName}
            onChange={handleChange}
          />
          <InputField
            id="email"
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <button
            type="button"
            onClick={handleNextStep}
            className="w-full py-2.5 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <InputField
            id="password"
            label="Create New Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
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
              View Password
            </label>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition duration-300"
            >
              Back
            </button>
            <button
              type="submit"
              className="py-2 px-6 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300"
            >
              Sign Up
            </button>
          </div>
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
