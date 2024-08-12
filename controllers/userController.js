const User = require("../models/User");
const cloudinary = require("../utils/upload");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/emailSender");
// Change password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(oldPassword))) {
      user.password = newPassword;
      await user.save();

      res.json({ message: "Password updated successfully" });
    } else {
      res.status(401).json({ message: "Incorrect old password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update email
exports.updateUserEmail = async (req, res) => {
  const { newEmail } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.email = newEmail;
      await user.save();

      // Send notification email
      const message = `Hi ${user.username}, your email has been updated successfully to ${newEmail}.`;
      await sendEmail({
        email: newEmail,
        subject: "Email Update Notification",
        message
      });

      res.json({ message: "Email updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update phone number
exports.updateUserPhone = async (req, res) => {
  const { newPhoneNumber } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.phoneNumber = newPhoneNumber;
      await user.save();

      res.json({ message: "Phone number updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload profile image
exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image file uploaded",
    });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.imageUrl = result.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Image uploaded and saved successfully",
      data: {
        imageUrl: user.imageUrl,
        cloudinaryResult: result,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message,
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//getUserProfile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        imageUrl: user.imageUrl, 
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update user information
exports.updateMe = async (req, res) => {
  const { username, newEmail, newPhoneNumber } = req.body;
  const userId = req.user._id; // Get userId from req.user

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update username if provided
    if (username) {
      user.username = username;
    }

    // Update email if provided
    if (newEmail) {
      user.email = newEmail;
    }

    // Update phone number if provided
    if (newPhoneNumber) {
      user.phoneNumber = newPhoneNumber;
    }

    await user.save();
    // Return the updated user information
    res.json({
      message: "User information updated successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

