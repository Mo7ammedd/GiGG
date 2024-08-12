const { getLyrics } = require("genius-lyrics-api");

const getLyricsHandler = (req, res) => {
  const { title, artist } = req.query;

  if (!title || !artist) {
    return res
      .status(400)
      .json({ message: "Missing required parameters: title and/or artist" });
  }

  const options = {
    title: title,
    artist: artist,
    apiKey: process.env.GENIUS_APi,
    optimizeQuery: true,
  };

  getLyrics(options)
  .then((lyrics) => {
    console.log('Lyrics response:', lyrics); // Log the response
    if (lyrics) {
      const versesArray = lyrics.split("\n\n");
      const response = {
        song: options.title,
        artist: options.artist,
        verses: versesArray.map((verse, index) => {
          return {
            number: index + 1,
            lyrics: verse,
          };
        }),
      };
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "Lyrics not found" });
    }
  })
  .catch((error) => {
    console.error('Error fetching lyrics:', error); // Log the error
    res.status(500).json({ message: "Internal server error" });
  });

};

module.exports = {
  getLyricsHandler,
};
