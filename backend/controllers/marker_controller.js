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