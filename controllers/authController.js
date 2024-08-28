const { User, UserOTP } = require("../models/User");
const generateToken = require("../utils/tokenUtils");
const sendEmail = require("../utils/emailSender");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  const { username, email, password, name } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password, name });

    await sendEmail({
      email: user.email,
      subject: "Welcome to GIGG!",
      type: "emailUpdate",
      username: user.username,
      profileLink: `http://yourapp.com/profile/${user._id}`,
      supportLink: "http://yourapp.com/support",
    });

    // Send OTP verification email
    const otpResult = await sendOTPVerificationEmail({
      email: user.email,
      username: user.username,
      userId: user._id,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      token: generateToken(user._id),
      otpResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendOTPVerificationEmail = async ({ email, username, userId }) => {
  try {
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

    // Send OTP email
    await sendEmail({
      email,
      subject: "OTP Verification",
      type: "emailVerification",
      username,
      otp,
    });

    const hashedOTP = await bcrypt.hash(otp, 10);
    const newOTP = new UserOTP({
      userId,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000,
    });

    await newOTP.save();
    return {
      success: "PENDING",
      message: "OTP sent successfully",
    };
  } catch (error) {
    return {
      success: "FAILED",
      message: "Failed to send OTP",
    };
  }
};

exports.verifyOTP = async (req, res) => {
  const { otp, userId } = req.body;

  try {
    if (!otp || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userOTP = await UserOTP.findOne({ userId });
    if (!userOTP) {
      return res.status(404).json({ message: "OTP not found for user" });
    }

    if (Date.now() > userOTP.expiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, userOTP.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if recent OTP exists
    const recentOTP = await UserOTP.findOne({ userId }).sort({ createdAt: -1 });
    if (recentOTP && Date.now() - recentOTP.createdAt < 60000) {
      return res.status(400).json({
        success: "خخخخخخخخخخخخخخخخ",
        message: "استني يا علق دقيقه",
      });
    }

    // Delete previous OTP record if it exists
    await UserOTP.findOneAndDelete({ userId });

    // Generate and send new OTP
    const otpResult = await sendOTPVerificationEmail({
      email: user.email,
      username: user.username,
      userId,
    });

    res.status(200).json(otpResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
