const express = require("express");
const { rateSong, addFavoriteSong, getFavoriteSongs } = require("../controllers/usersongsController"); 
const { protect } = require("../middlewares/authMiddleware");
const { getUserPlaylistsHandler } = require("../controllers/spotifyController");
const router = express.Router();

router.post("/rate-song", protect, rateSong);



router.get("/playlists", protect, getUserPlaylistsHandler);

module.exports = router;
