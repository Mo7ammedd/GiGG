const express = require('express');
const { 
    getRandomSongsHandler, 
    searchSongByNameHandler, 
    getTopSongsInEgyptHandler, 
    spotifyLogin, 
    spotifyCallback, 
    getRecentlyPlayedHandler 
} = require('../controllers/spotifyController');

const router = express.Router();

router.get('/random-songs', getRandomSongsHandler);
router.get('/search-song', searchSongByNameHandler);
router.get('/top-songs-egypt', getTopSongsInEgyptHandler);


router.get('/playlists', getUserPlaylistsHandler);

//  OAuth routes
router.get('/login', spotifyLogin);
router.get('/callback', spotifyCallback);
router.get('/recently-played', getRecentlyPlayedHandler);

module.exports = router;
