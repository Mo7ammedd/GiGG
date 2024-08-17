const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

module.exports = function () {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email =
            profile.emails && profile.emails[0] && profile.emails[0].value;

          if (!email) {
            return done(new Error("No email found in Google profile"), null);
          }

          let user = await User.findOne({ email });

          if (user) {
            return done(null, user);
          } else {
            // Ensure the username is not null and unique
            const username = profile.displayName || profile.id;
            user = new User({
              googleId: profile.id,
              displayName: profile.displayName,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: email, // for email verification
              username: username, // for username verification
              googleImageUrl: profile.photos[0].value,
            });

            // Save the user
            user = await user.save();

            await user.save();
            return done(null, user);
          }
        } catch (err) {
          console.error("Error during Google OAuth:", err);
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
