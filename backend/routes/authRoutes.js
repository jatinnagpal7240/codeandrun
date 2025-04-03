const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

const otpStore = {}; // Temporary OTP storage (Replace with DB in production)

// Function to generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Check if user exists
router.post("/check-user", async (req, res) => {
  try {
    const { email, phone } = req.body;
    const user = await User.findOne({ $or: [{ email }, { phone }] });

    if (user) {
      return res.json({ exists: true, message: "User already exists." });
    }
    return res.json({ exists: false });
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Send OTP for Signup
router.post("/send-otp", async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ message: "Email and Phone are required." });
    }

    // Generate and store OTPs
    const otpPhone = generateOTP();
    const otpEmail = generateOTP();

    otpStore[email] = otpEmail;
    otpStore[phone] = otpPhone;

    console.log(`OTP for ${email}: ${otpEmail}`);
    console.log(`OTP for ${phone}: ${otpPhone}`);

    res.json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("OTP Sending Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Verify OTP & Register User
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, phone, password, otpEmail, otpPhone } = req.body;

    if (!otpStore[email] || !otpStore[phone]) {
      return res.status(400).json({ message: "OTP expired or not sent." });
    }

    if (otpStore[email] !== otpEmail || otpStore[phone] !== otpPhone) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ phone, email, password: hashedPassword });
    await newUser.save();

    // Remove OTP from temporary store
    delete otpStore[email];
    delete otpStore[phone];

    return res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
