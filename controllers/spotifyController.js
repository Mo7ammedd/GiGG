const axios = require('axios');

const getSpotifyAccessToken = async () => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: process.env.SPOTIFY_CLIENT_ID,
          password: process.env.SPOTIFY_CLIENT_SECRET,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw error;
  }
};

const getRandomSongs = async (accessToken, limit = 50) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: 'genre:pop', 
        type: 'track',
        limit: limit,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const tracks = response.data.tracks.items;

    const shuffledTracks = tracks.sort(() => 0.5 - Math.random());
    const randomTracks = shuffledTracks.slice(0, limit);

    return randomTracks.map(track => ({
      song: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      preview_url: track.preview_url,
      album_image: track.album.images[0]?.url, 
    }));
  } catch (error) {
    console.error('Error fetching random songs:', error.response?.data || error.message);
    throw error;
  }
};

const searchSongByName = async (accessToken, songName) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: songName,
        type: 'track',
        limit: 10, // Adjust the limit as per your needs
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Return the relevant data from the response
    return response.data.tracks.items.map(track => ({
      song: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      preview_url: track.preview_url,
      album_image: track.album.images[0]?.url, // Include album artwork URL
    }));
  } catch (error) {
    console.error('Error searching for song:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  getSpotifyAccessToken,
  getRandomSongs,
  searchSongByName, 
};