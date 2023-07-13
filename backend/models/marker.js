const mongoose = require('mongoose');

const markerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    
  },
  description: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },

});

const Marker = mongoose.model('Marker', markerSchema);

module.exports = Marker;
