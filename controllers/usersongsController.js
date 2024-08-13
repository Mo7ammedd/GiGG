const User = require("../models/User");

const rateSong = async (req, res) => {
    const { song, artist, album, rating, album_image, preview_url } = req.body;

    if (!song || !artist || !album || !rating) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingRating = user.ratings.find(r => r.song === song && r.artist === artist && r.album === album);

        if (existingRating) {
            existingRating.rating = rating;
        } else {
            user.ratings.push({ song, artist, album, rating, album_image, preview_url });
        }

        await user.save();

        res.status(200).json({ message: "Rating saved successfully" });
    } catch (error) {
        console.error('Error saving rating:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    rateSong,
};
