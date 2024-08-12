const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const lyricsRoutes = require('./routes/lyricsRoutes'); 
const { errorHandler } = require('./utils/errorHandler');

dotenv.config();

connectDB();

const app = express();

app.use(cors()); 

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', lyricsRoutes); 

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
