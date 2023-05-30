const mongoose = require('mongoose');
const Marker = require('./marker');

const itinerarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
 
  stations:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Marker",
    
    
  },]
 
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;


