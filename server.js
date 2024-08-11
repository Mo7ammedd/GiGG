const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const lyricsRoutes = require("./routes/lyricsRoutes");
const { errorHandler } = require("./utils/errorHandler");
const uploadController = require("./controllers/uploadController");
const fs = require("fs");
const path = require("path");

dotenv.config();

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use("/api", uploadController);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/lyrics", lyricsRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
