const express = require('express');
const Bus = require('../models/bus');



exports.getAllBuses = async function(req, res) {
  try {
    const buses = await Bus.find().populate({
      path: "itinerary",populate: {
        path: "stations",
      }

    });
    res.json(buses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.createBus = async function(req, res) {
    try {
      const { name, itinerary,number_places, startingTime, returnTime } = req.body;
      var bus = await Bus.create(req.body);
  
      res.json(bus);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  };
  
  exports.updateBus = async function(req, res) {
    try {
      const busId = req.params.id;
      const updates = req.body;
  
      // Find the bus by ID
      const bus = await Bus.findById(busId);
      if (!bus) {
        return res.status(404).json({ message: 'Bus not found' });
      }
  
      // Update the bus with the given updates
      Object.assign(bus, updates);
      const updatedBus = await bus.save();
      
      res.json(updatedBus);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  exports.deleteBus = async function(req, res) {
    try {
      const busId = req.params.id;
  
      // Find the bus by ID
      const bus = await Bus.findById(busId);
      if (!bus) {
        return res.status(404).json({ message: 'Bus not found' });
      }
  
      const deletedBus = await Bus.findByIdAndDelete(busId);
      if (!deletedBus) {
        return res.status(404).json({ message: 'Bus not found' });
      }
      res.json(deletedBus);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // delete employees
exports.deleteBuses = async function (req, res) {
  try {
  const { BusesIds } = req.body;

  // Convert employeeIds to an array if it's not already
  const ids = Array.isArray(BusesIds) ? BusesIds : [BusesIds];
  
  const result = await Bus.deleteMany({ _id: { $in: ids } });
  if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'Buses not found' });
  }

  res.status(200).json({ message: 'Buses deleted successfully' });
} catch (e) {
  res.status(400).json({ error: e.message });
}
};

  