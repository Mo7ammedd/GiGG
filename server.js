const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const lyricsRoutes = require("./routes/lyricsRoutes");
const { errorHandler } = require("./utils/errorHandler");
const fs = require("fs");
const path = require("path");

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", lyricsRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
