const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models/User");

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
            // Combine firstName and lastName into name
            const firstName = profile.name.givenName || ""; // Use 'givenName' if available
            const lastName = profile.name.familyName || ""; // Use 'familyName' if available
            const name = `${firstName} ${lastName}`.trim(); // Remove leading/trailing spaces

            // Generate a base username using the name
            let baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, "");

            // Check if the base username is already taken
            let username = baseUsername;
            let existingUser = await User.findOne({ username });
            while (existingUser) {
              // Append a random 4-digit number to the username
              const randomUsername = Math.floor(1000 + Math.random() * 9000);
              username = `${baseUsername}${randomUsername}`;
              existingUser = await User.findOne({ username });
            }

            user = new User({
              googleId: profile.id,
              displayName: profile.displayName,
              name: name, // Use the combined name field
              email: email,
              username: username, // Use the generated unique username
            });

            // Save the user
            user = await user.save();
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
