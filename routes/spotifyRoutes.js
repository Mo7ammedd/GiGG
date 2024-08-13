const express = require("express");
const { getRandomSongsHandler, searchSongByNameHandler ,getTopSongsInEgyptHandler } = require("../controllers/spotifyController");

const router = express.Router();

router.get("/random-songs", getRandomSongsHandler);
router.get("/search-song", searchSongByNameHandler);
router.get("/top-songs-egypt", getTopSongsInEgyptHandler);


module.exports = router;
