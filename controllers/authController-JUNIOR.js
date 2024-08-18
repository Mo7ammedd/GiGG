const User = require('../models/User');
const generateToken = require('../utils/tokenUtils');
const sendEmail = require('../utils/emailSender'); // Import sendEmail

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, email, password, name } = req.body; 

  try {
      // Check if user already exists
      const userExists = await User.findOne({ email });

      if (userExists) {
          return res.status(400).json({ message: 'User already exists' });
      }

      // Create a new user
      const user = await User.create({ username, email, password, name }); 

      // Send welcome email
      await sendEmail({
          email: user.email,
          subject: "Welcome to GIGG!",
          username: user.username,
          changeType: "welcome",
          newValue: "", // No new value needed for welcome email
          profileLink: `http://yourapp.com/profile/${user._id}`,
          supportLink: "http://yourapp.com/support",
      });

      // Respond with user data and token
      res.status(201).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          token: generateToken(user._id),
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
  // Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};