// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerMiddleware");
const { uploadImage } = require("../controllers/uploadController");

// Define the upload route
router.post("/", upload.single("image"), uploadImage);

module.exports = router; // Make sure to export the router
