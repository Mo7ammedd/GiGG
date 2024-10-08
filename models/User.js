const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

const UserOTPSchema = new mongoose.Schema({
  userId: String,
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

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
    name: {
      type: String,
      required: function () {
        return !this.googleId; // Require name if not using Google OAuth
      },
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Require password if not using Google OAuth
      },
    },
    phoneNumber: String,

    googleId: {
      type: String,
      unique: true,
    },

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

module.exports = {
  User: mongoose.model("User", UserSchema),
  UserOTP: mongoose.model("UserOTP", UserOTPSchema),
};
