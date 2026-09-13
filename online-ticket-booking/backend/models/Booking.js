const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainId: { type: String, required: true },
  trainNumber: { type: String, required: true },
  trainName: { type: String, required: true },
  fromStation: { type: String, required: true, uppercase: true },
  toStation: { type: String, required: true, uppercase: true },
  journeyDate: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  amount: { type: Number, required: true, min: 1 },
  orderId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

bookingSchema.index({ trainId: 1, journeyDate: 1, status: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
