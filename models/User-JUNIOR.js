const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const RatingSchema = new mongoose.Schema(
  {
    song: String,
    artist: String,
    album: String,
    rating: Number,
    album_image: String,
    preview_url: String,
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: function () {
        return !this.googleId; // Require username if not using Google OAuth
      },
      unique: true,
    },
    email: {
      type: String,
      required: function () {
        return !this.googleId; // Require email if not using Google OAuth
      },
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Require password if not using Google OAuth
      },
    },
    phoneNumber: String,
    imageUrl: String,

    googleId: {
      type: String,
      unique: true,
    },
    firstName: String,
    lastName: String,
    displayName: String,
    googleImageUrl: String,

    ratings: [RatingSchema],
  },
  { timestamps: true }
);

// Hash the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
