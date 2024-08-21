const express = require("express");
const {
  getRandomSongsHandler,
  searchSongByNameHandler,
  getTopSongsInEgyptHandler,
  getTrendSongsInEgyptHandler,
  getTopMahraganatHandler,
  getMixComfySongsHandler,
  getStudyAndRelaxingSongsHandler,
  spotifyLogin,
  spotifyCallback,
  getRecentlyPlayedHandler,
  getUserPlaylistsHandler,
  getTaylorSwiftPlaylistHandler,
} = require("../controllers/spotifyController");

const router = express.Router();

router.get("/random-songs", getRandomSongsHandler);
router.get("/search-song", searchSongByNameHandler);
router.get("/top-songs-egypt", getTopSongsInEgyptHandler);
router.get("/trend-songs-egypt", getTrendSongsInEgyptHandler);
router.get("/top-mahraganat", getTopMahraganatHandler);
router.get("/mix-comfy", getMixComfySongsHandler);
router.get("/study-and-relaxing", getStudyAndRelaxingSongsHandler);
router.get("/playlists", getUserPlaylistsHandler);

router.get("/login", spotifyLogin);
router.get("/callback", spotifyCallback);
router.get("/recently-played", getRecentlyPlayedHandler);
router.get("/taylorswift", getTaylorSwiftPlaylistHandler);

module.exports = router;
