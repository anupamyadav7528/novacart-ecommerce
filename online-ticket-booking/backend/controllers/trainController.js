const Booking = require('../models/Booking');

const schedules = [
  { trainNumber: '22435', trainName: 'Vande Bharat Express', departureTime: '15:00', arrivalTime: '23:00', price: 1600 },
  { trainNumber: '12561', trainName: 'Swatantrata Senani Exp', departureTime: '19:00', arrivalTime: '08:30', price: 450 },
  { trainNumber: '12002', trainName: 'Shatabdi Express', departureTime: '06:15', arrivalTime: '14:20', price: 950 },
  { trainNumber: '12424', trainName: 'Rajdhani Express', departureTime: '21:50', arrivalTime: '06:40', price: 2100 },
  { trainNumber: '12204', trainName: 'Garib Rath Express', departureTime: '13:10', arrivalTime: '22:45', price: 580 },
  { trainNumber: '12301', trainName: 'Kolkata Rajdhani', departureTime: '16:55', arrivalTime: '09:55', price: 2300 },
  { trainNumber: '12952', trainName: 'Mumbai Rajdhani', departureTime: '17:00', arrivalTime: '08:35', price: 2400 }
];
const SEAT_CAPACITY = 60;

const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00`));

const searchTrains = async (req, res) => {
  try {
    const from = String(req.query.from || '').trim().toUpperCase();
    const to = String(req.query.to || '').trim().toUpperCase();
    const journeyDate = String(req.query.date || '');
    if (!from || !to || from === to || !validDate(journeyDate)) {
      return res.status(400).json({ message: 'Different stations and a valid journey date are required' });
    }
    const trains = await Promise.all(schedules.map(async (train, index) => {
      const trainId = `matrix-${train.trainNumber}`;
      const booked = await Booking.countDocuments({ trainId, journeyDate, status: 'confirmed' });
      return {
        _id: trainId,
        ...train,
        fromStation: from,
        toStation: to,
        journeyDate,
        seatsAvailable: Math.max(0, SEAT_CAPACITY - booked)
      };
    }));
    return res.json({ success: true, trains });
  } catch (error) {
    console.error('Search Error:', error);
    return res.status(500).json({ message: 'Unable to search trains right now' });
  }
};

const listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId }).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, bookings });
  } catch (error) {
    console.error('Booking List Error:', error);
    return res.status(500).json({ message: 'Unable to load your bookings' });
  }
};

const bookTrainSeat = async (req, res) => {
  try {
    const { trainId, trainNumber, trainName, fromStation, toStation, journeyDate, departureTime, arrivalTime, price } = req.body;
    const amount = Number(price);
    if (!trainId || !trainNumber || !trainName || !fromStation || !toStation || !departureTime || !arrivalTime ||
      !validDate(journeyDate) || !Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Complete train and journey details are required' });
    }

    const existing = await Booking.countDocuments({ trainId, journeyDate, status: 'confirmed' });
    if (existing >= SEAT_CAPACITY) {
      return res.status(409).json({ message: 'This train is sold out for the selected date' });
    }

    const orderId = `order_sandbox_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const booking = await Booking.create({
      user: req.userId, trainId, trainNumber, trainName, fromStation, toStation,
      journeyDate, departureTime, arrivalTime, amount, orderId
    });
    return res.status(201).json({
      success: true,
      isSandbox: true,
      booking: booking.toObject()
    });
  } catch (error) {
    console.error('Booking Error:', error);
    return res.status(500).json({ message: 'Unable to confirm the booking' });
  }
};

module.exports = { searchTrains, bookTrainSeat, listBookings };
