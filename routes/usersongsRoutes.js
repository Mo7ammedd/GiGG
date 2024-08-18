const express = require("express");
const { rateSong } = require("../controllers/usersongsController"); 
const { protect } = require("../middlewares/authMiddleware");
const { getUserPlaylistsHandler } = require("../controllers/spotifyController");
const router = express.Router();

router.post("/rate-song", protect, rateSong);

router.post("/favorite-song", protect, addFavoriteSong);

router.get("/favorites", protect, getFavoriteSongs);

router.get("/playlists", protect, getUserPlaylistsHandler);

module.exports = router;
