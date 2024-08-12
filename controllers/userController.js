const User = require('../models/User');

// Change password
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (user && (await user.matchPassword(oldPassword))) {
            user.password = newPassword;
            await user.save();

            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Incorrect old password' });
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

            res.json({ message: 'Email updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
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

            res.json({ message: 'Phone number updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//getUserProfile
exports.getUserProfile = async (req, res) => {
  try {
      const user = await User.findById(req.user._id).select('-password'); // Exclude the password field

      if (user) {
          res.json(user);
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
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
// Update user information
exports.updateMe = async (req, res) => {
  const { username, newEmail, newPhoneNumber } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //Update username if provided
    if (username) {
      user.username = req.body.username;
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
