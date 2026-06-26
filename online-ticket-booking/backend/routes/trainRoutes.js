const express = require('express');
const router = express.Router();
const { searchTrains, bookTrainSeat } = require('../controllers/trainController');

// Routes link karein
router.get('/search', searchTrains);
router.post('/book', bookTrainSeat);

module.exports = router;