const mongoose = require('mongoose');
const Marker = require('./marker');
const Itinerary = require('./itinerary');

const busSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
  itinerary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Itinerary",
  },
  number_places: {
    type: Number,
  },
    
    startingTime: {
      type: String,
      required: true,
    },
    returnTime: {
      type: String,
      required: true,
    },
   
  
});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
