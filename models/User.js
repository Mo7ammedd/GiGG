const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    song: String,
    artist: String,
    album: String,
    rating: Number,
    album_image: String,
    preview_url: String,
}, { _id: false });

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: String,
    imageUrl: String,
    name: {
        type: String,
        required: true,
    },
    ratings: [RatingSchema], 
}, { timestamps: true });

// Hash the password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
