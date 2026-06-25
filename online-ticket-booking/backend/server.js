const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Base Route (Just checking)
app.get('/', (req, res) => {
    res.send('BLW Online Ticket Booking Server is running perfectly...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});