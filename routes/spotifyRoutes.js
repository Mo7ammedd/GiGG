const express = require('express');
const { getSpotifyAccessToken, getRandomSongs } = require('../controllers/spotifyController');

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

module.exports = router;
