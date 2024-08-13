const express = require('express');
const { getSpotifyAccessToken, getRandomSongs,searchSongByName } = require('../controllers/spotifyController');

const router = express.Router();

router.get('/random-songs', async (req, res) => {
  try {
    const accessToken = await getSpotifyAccessToken();
    const songs = await getRandomSongs(accessToken, 50); 

    if (songs.length > 0) {
      res.status(200).json(songs);
    } else {
      res.status(404).json({ message: 'No songs found' });
    }
  } catch (error) {
    console.error('Error handling /random-songs request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/search-song', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: "Missing required parameter: name" });
  }

  try {
    const accessToken = await getSpotifyAccessToken();
    const songs = await searchSongByName(accessToken, name);

    if (songs.length > 0) {
      res.status(200).json(songs);
    } else {
      res.status(404).json({ message: 'No songs found' });
    }
  } catch (error) {
    console.error('Error handling /search-song request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
