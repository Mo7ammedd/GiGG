const express = require('express');
const { changePassword, updateUserEmail, updateUserPhone, getUserProfile} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Protected routes
router.put('/change-password', protect, changePassword);
router.put('/change-email', protect, updateUserEmail);
router.put('/change-phone', protect, updateUserPhone);
router.get('/me', protect, getUserProfile);


module.exports = router;
