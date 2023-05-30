const express = require('express');

const Marker = require('../models/marker');


exports.addMarker = async function(req, res) {
  try {
    const { name, description, latitude, longitude } = req.body;
    const marker = new Marker({ name, description, latitude, longitude });
    await marker.save();
    res.json(marker);
  } catch (err) {
    console.error(err.message);
    res.status(400).send('Server Error');
  }
  };



  // Get all markers from the database
exports.getAllMarkers = async function (req, res) {
    try {
      const markers = await Marker.find();
      res.json(markers);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

  // Delete a marker from the database
exports.deleteMarker = async function (req, res) {
  try {
    const markerId = req.params.id;
    const deletedMarker = await Marker.findByIdAndDelete(markerId);
    if (!deletedMarker) {
      return res.status(404).json({ message: 'Marker not found' });
    }
    res.json(deletedMarker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a marker in the database
exports.updateMarker = async function (req, res) {
  try {
    const markerId = req.params.id;
    const updates = req.body;
    const options = { new: true };
    const updatedMarker = await Marker.findByIdAndUpdate(markerId, updates, options);
    if (!updatedMarker) {
      return res.status(404).json({ message: 'Marker not found' });
    }
    res.json(updatedMarker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete multiple markers
exports.deleteMarkers =  async function (req, res) {
  try {
    const { stationIds } = req.body;
  
    // Convert employeeIds to an array if it's not already
    const ids = Array.isArray(stationIds) ? stationIds : [stationIds];
    
    const result = await Marker.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'stations not found' });
    }
  
    res.status(200).json({ message: 'stations deleted successfully' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
