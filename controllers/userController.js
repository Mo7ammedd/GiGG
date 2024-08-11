const User = require('../models/User');

// Update user information
exports.updateMe = async (req, res) => {
    const { oldPassword, newPassword, newEmail, newPhoneNumber } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update password if provided
        if (oldPassword && newPassword) {
            if (await user.matchPassword(oldPassword)) {
                user.password = newPassword;
            } else {
                return res.status(401).json({ message: 'Incorrect old password' });
            }
        }

        // Update email if provided
        if (newEmail) {
            user.email = newEmail;
        }

        // Update phone number if provided
        if (newPhoneNumber) {
            user.phoneNumber = newPhoneNumber;
        }

        // Save updated user
        await user.save();

        res.json({ message: 'User information updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
