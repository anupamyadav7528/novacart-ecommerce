const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to Database (User details & Auth ke liye abhi bhi chalega)
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
    console.error('Request Error:', err);
    res.status(400).json({ message: 'Invalid request' });
});

// Routes Registered
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trains', require('./routes/trainRoutes')); // <-- Live Train Matrix Route

// Base Route (Just checking)
app.get('/', (req, res) => {
    res.send('BLW Online Ticket Booking Server is running perfectly with Live API...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
    console.log(`📡 Live Train Search System is active!`);
});