const express = require("express");
const {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
} = require("../controllers/authController");

const passport = require("passport");
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

// Verify OTP
router.post("/verifyOTP", verifyOTP);

// Resend OTP
router.post("/resendOTP", resendOTP);

// Google OAuth login route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
