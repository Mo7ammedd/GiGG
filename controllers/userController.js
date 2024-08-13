const User = require("../models/User");
const cloudinary = require("../utils/upload");
const sendEmail = require("../utils/emailSender");

// Change password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(oldPassword))) {
      user.password = newPassword;
      await user.save();

      await sendEmail({
        email: user.email,
        subject: "Password Changed Notification",
        username: user.username,
        changeType: "password",
        newValue: "********", // Password not shown for security reasons
        profileLink: `http://yourapp.com/profile/${user._id}`,
        supportLink: "http://yourapp.com/support",
      });

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
      await sendEmail({
        email: newEmail,
        subject: "Email Update Notification",
        username: user.username,
        changeType: "email",
        newValue: newEmail,
        profileLink: `http://yourapp.com/profile/${user._id}`,
        supportLink: "http://yourapp.com/support",
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

      // Send email notification
      await sendEmail({
        email: user.email,
        subject: "Phone Number Update Notification",
        username: user.username,
        changeType: "phone number",
        newValue: newPhoneNumber,
        profileLink: `http://yourapp.com/profile/${user._id}`,
        supportLink: "http://yourapp.com/support",
      });

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

// Get user profile
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
        ratings: user.ratings,
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
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let changes = [];
    if (username) {
      user.username = username;
      changes.push(`username to ${username}`);
    }
    if (newEmail) {
      user.email = newEmail;
      changes.push(`email to ${newEmail}`);
    }
    if (newPhoneNumber) {
      user.phoneNumber = newPhoneNumber;
      changes.push(`phone number to ${newPhoneNumber}`);
    }

    await user.save();

    // Send email notification
    const message = `Hi ${user.username}, your profile information has been updated successfully. Changes made: ${changes.join(", ")}.`;
    await sendEmail({
      email: user.email,
      subject: "Profile Update Notification",
      message,
    });

    res.json({
      message: "User information updated successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      userDeleted: deletedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete all users
exports.deleteAllUsers = async (req, res) => {
  try {
    const usersToDelete = await User.find({});
    const deletedUsers = await User.deleteMany({});
    res.json({
      message: "All users deleted successfully",
      deletedUsers: usersToDelete,
      deletedItemsCount: deletedUsers.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
