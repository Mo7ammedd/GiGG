const express = require('express');
const { updateMe } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Protected route for updating user information
router.patch('/update-me', protect, updateMe);

module.exports = router;
