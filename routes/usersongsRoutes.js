const express = require("express");
const { rateSong } = require("../controllers/usersongsController"); 
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/rate-song", protect, rateSong);

module.exports = router;
