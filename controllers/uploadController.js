const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const cloudinary = require("../utils/upload");

router.post("/", upload.single("image"), (req, res) => {
  // Check if an image was uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image file uploaded",
    });
  }

  cloudinary.uploader.upload(req.file.path, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error uploading to Cloudinary",
      });
    }
    res.status(200).json({
      success: true,
      message: "Uploaded successfully",
      data: result,
    });
  });
});

module.exports = router;
