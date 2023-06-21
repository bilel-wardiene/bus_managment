const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  itinerary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Itinerary",
    required: true,
  },
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Marker",
    required: true,
  },
  places: {
    type: Number,
    required: true,
  },
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
