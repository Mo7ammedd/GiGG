const express = require("express");
const {
  changePassword,
  updateUserEmail,
  updateUserPhone,
  uploadImage,
  getAllUsers,
  getUserById,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");
const router = express.Router();

// Protected routes
router.put("/change-password", protect, changePassword);
router.put("/change-email", protect, updateUserEmail);
router.put("/change-phone", protect, updateUserPhone);
router.post("/upload-img", protect, upload.single("image"), uploadImage);
router.get("/all", protect, getAllUsers);
router.get("/:id", protect, getUserById);

module.exports = router;
