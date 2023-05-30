const express = require('express');

const Itinerary = require('../models/itinerary');
const e = require('express');
const Marker = require('../models/marker');

exports.createItinerary = async function (req, res) {
  try {

    const { name, stations } = req.body;
  
    const i = await new Itinerary({ name,stations}); 
    const t = await i.save();
    
    res.json(t);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllItineraries = async function (req, res) {
  try {
    const itineraries = await Itinerary.find().populate({
      path: "stations",
    });
    res.json(itineraries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteItinerary = async function (req, res) {
  try {
    const itineraryId = req.params.id;
    const deletedItinerary = await Itinerary.findByIdAndDelete(itineraryId);
    if (!deletedItinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    res.json(deletedItinerary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateItinerary = async function (req, res) {
  try {
    const itineraryId = req.params.id;
    const updates = req.body;
    const options = { new: true };
    const updatedItinerary = await Itinerary.findByIdAndUpdate(itineraryId, updates, options);
    if (!updatedItinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    res.json(updatedItinerary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete multiple Itineraries
exports.deleteItineraries =  async function (req, res) {
  try {
    const { ItinerariesIds } = req.body;
  
    // Convert employeeIds to an array if it's not already
    const ids = Array.isArray(ItinerariesIds) ? ItinerariesIds : [ItinerariesIds];
    
    const result = await Itinerary.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Itineraries not found' });
    }
  
    res.status(200).json({ message: 'Itineraries deleted successfully' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};


