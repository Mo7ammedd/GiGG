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