const express = require('express');
const { changePassword, updateUserEmail, updateUserPhone, getUserProfile,getAllUsers,getUserById,updateMe} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Protected routes
router.put('/change-password', protect, changePassword);
router.put('/change-email', protect, updateUserEmail);
router.put('/change-phone', protect, updateUserPhone);
router.get("/all", protect, getAllUsers);
router.get("/:id", protect, getUserById);
router.get('/me', protect, getUserProfile);
router.patch("/update-Me", protect, updateMe);


module.exports = router;
