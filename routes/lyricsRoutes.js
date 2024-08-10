const express = require('express');
const { getLyricsHandler } = require('../controllers/lyricsController');

const router = express.Router();

router.get('/lyrics', getLyricsHandler);

module.exports = router;
