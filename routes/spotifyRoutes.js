const express = require("express");
const { getRandomSongsHandler, searchSongByNameHandler } = require("../controllers/spotifyController");

const router = express.Router();

router.get("/random-songs", getRandomSongsHandler);
router.get("/search-song", searchSongByNameHandler);

module.exports = router;
