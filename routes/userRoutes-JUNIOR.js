const express = require("express");
const {
  changePassword,
  updateUserEmail,
  updateUserPhone,
  uploadImage,
  getAllUsers,
  getUserById,
  updateMe,
  getUserProfile,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");
const router = express.Router();

router.put("/change-password", protect, changePassword);
router.put("/change-email", protect, updateUserEmail);
router.put("/change-phone", protect, updateUserPhone);
router.get("/me", protect, getUserProfile);
router.patch("/update-me", protect, updateMe);
router.post("/upload-img", protect, upload.single("image"), uploadImage);
router.get("/all", protect, getAllUsers);
router.get("/:id", protect, getUserById);
router.delete("/delete/:id", protect, deleteUser);

module.exports = router;
