const express = require('express');
const { 
    getRandomSongsHandler, 
    searchSongByNameHandler, 
    getTopSongsInEgyptHandler, 
    spotifyLogin, 
    spotifyCallback, 
    getRecentlyPlayedHandler ,
    getUserPlaylistsHandler,
    getTaylorSwiftPlaylistHandler,
    getPopularArtistsHandler
} = require('../controllers/spotifyController');

const router = express.Router();

router.get('/random-songs', getRandomSongsHandler);
router.get('/search-song', searchSongByNameHandler);
router.get('/top-songs-egypt', getTopSongsInEgyptHandler);


router.get('/playlists', getUserPlaylistsHandler);

router.get('/login', spotifyLogin);
router.get('/callback', spotifyCallback);
router.get('/recently-played', getRecentlyPlayedHandler);
router.get('/taylorswift', getTaylorSwiftPlaylistHandler);
router.get('/top-artists', getPopularArtistsHandler);

module.exports = router;
