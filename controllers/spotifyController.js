const axios = require("axios");

// Fetch Spotify access token
const getSpotifyAccessToken = async () => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
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
};

// Fetch random songs
const getRandomSongs = async (accessToken, limit = 50) => {
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
};

// Search for songs by name
const searchSongByName = async (accessToken, songName) => {
  const response = await axios.get('https://api.spotify.com/v1/search', {
    params: {
      q: songName,
      type: 'track',
      limit: 10,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data.tracks.items.map(track => ({
    song: track.name,
    artist: track.artists.map(artist => artist.name).join(', '),
    album: track.album.name,
    preview_url: track.preview_url,
    album_image: track.album.images[0]?.url,
  }));
};

// Fetch top songs in Egypt
const getTopSongsInEgypt = async (accessToken) => {
  const response = await axios.get('https://api.spotify.com/v1/playlists/37i9dQZEVXbLn7RQmT5Xv2/tracks', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data.items.map(item => {
    const track = item.track;
    return {
      song: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      preview_url: track.preview_url,
      album_image: track.album.images[0]?.url,
    };
  });
};

// Fetch recently played tracks
const getRecentlyPlayed = async (accessToken) => {
  const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    timeout: 10000, 
  });

  return response.data.items.map(item => {
    const track = item.track;
    return {
      song: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      played_at: item.played_at,
      album_image: track.album.images[0]?.url,
    };
  });
};

// Fetch user's playlists
const getUserPlaylists = async (accessToken) => {
  const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data.items.map(playlist => ({
    name: playlist.name,
    description: playlist.description,
    tracks: playlist.tracks.total,
    image: playlist.images[0]?.url,
    external_url: playlist.external_urls.spotify,
  }));
};

// Get Spotify access token using authorization code
const getUserAccessToken = async (code) => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
  };
};

// Handlers for the routes
const getRandomSongsHandler = async (req, res) => {
  try {
    const accessToken = await getSpotifyAccessToken();
    const songs = await getRandomSongs(accessToken, 50);
    res.status(songs.length > 0 ? 200 : 404).json(songs.length > 0 ? songs : { message: 'No songs found' });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const searchSongByNameHandler = async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ message: 'Missing required parameter: name' });

  try {
    const accessToken = await getSpotifyAccessToken();
    const songs = await searchSongByName(accessToken, name);
    res.status(songs.length > 0 ? 200 : 404).json(songs.length > 0 ? songs : { message: 'No songs found' });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getTopSongsInEgyptHandler = async (req, res) => {
  try {
    const accessToken = await getSpotifyAccessToken();
    const songs = await getTopSongsInEgypt(accessToken);
    res.status(songs.length > 0 ? 200 : 404).json(songs.length > 0 ? songs : { message: 'No songs found' });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const spotifyLogin = (req, res) => {
  const scope = 'user-read-recently-played';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
};

const spotifyCallback = async (req, res) => {
  const code = req.query.code || null;

  try {
    const { access_token } = await getUserAccessToken(code);
    res.redirect(`/recently-played?access_token=${access_token}`);
  } catch {
    res.redirect('/login');
  }
};

const getRecentlyPlayedHandler = async (req, res) => {
  const accessToken = req.query.access_token;

  if (!accessToken) return res.status(400).json({ message: 'Access token is required' });

  try {
    const recentlyPlayed = await getRecentlyPlayed(accessToken);
    res.status(recentlyPlayed.length > 0 ? 200 : 404).json(recentlyPlayed.length > 0 ? recentlyPlayed : { message: 'No recently played tracks found' });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserPlaylistsHandler = async (req, res) => {
  const accessToken = req.query.access_token;

  if (!accessToken) {
    return res.status(400).json({ message: 'Access token is required' });
  }

  try {
    const playlists = await getUserPlaylists(accessToken);
    res.status(playlists.length > 0 ? 200 : 404).json(playlists.length > 0 ? playlists : { message: 'No playlists found' });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  spotifyLogin,
  spotifyCallback,
  getRecentlyPlayedHandler,
  getSpotifyAccessToken,
  getRandomSongsHandler,
  searchSongByNameHandler,
  getTopSongsInEgyptHandler,
  getUserPlaylistsHandler, 
};
