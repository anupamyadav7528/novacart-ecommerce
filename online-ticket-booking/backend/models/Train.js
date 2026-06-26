const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true, unique: true },
  trainName: { type: String, required: true },
  fromStation: { type: String, required: true, uppercase: true },
  toStation: { type: String, required: true, uppercase: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  seatsAvailable: { type: Number, required: true, default: 60 },
  price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Train', trainSchema);