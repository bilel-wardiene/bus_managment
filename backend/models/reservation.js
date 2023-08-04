const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  Time: {
    type: String,
    required: true
  },
  
  itinerary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerary',
    required: true
  },
  stations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marker'
  }],
  
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employe',
    required: true,
  },
  busId: { // Add the busId field
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
 

});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
