const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const lyricsRoutes = require("./routes/lyricsRoutes");
const { errorHandler } = require("./utils/errorHandler");
const spotifyRoutes = require("./routes/spotifyRoutes");
const userSongsRoutes = require("./routes/userSongsRoutes");

dotenv.config();
// Passport config
require("./config/passport")(passport);
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());

// Session middleware
app.use(
  session({
    secret: "keyboard cat", // Replace with a strong secret key
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// Use the routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", lyricsRoutes);
app.use("/api", spotifyRoutes);
app.use("/api", userSongsRoutes);
app.get("/dashboard", (req, res) => {
  res.send("<h1>كسم السيسي</h1>");
});
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
