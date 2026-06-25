const express = require('express');
const router = express.Router();
// Rasta ekdam sahi hona chahiye: ek step bahar (..), phir controllers folder
const authController = require('../controllers/authController');

router.post('/signup', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;