const express = require('express');
const router = express.Router();
const { searchTrains, bookTrainSeat, listBookings } = require('../controllers/trainController');
const { requireAuth } = require('../middleware/authMiddleware');

// Routes link karein
router.get('/search', searchTrains);
router.post('/book', requireAuth, bookTrainSeat);
router.get('/bookings', requireAuth, listBookings);

module.exports = router;