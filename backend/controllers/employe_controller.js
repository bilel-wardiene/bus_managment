const express = require("express");

const jwt = require("jsonwebtoken");
const Employe = require("../models/employe");
const Bus = require("../models/bus");
const Reservation = require("../models/reservation");
const Marker = require("../models/marker");
const Itinerary = require("../models/itinerary");

// Sign In 

exports.signin = async function (req, res) {
    try {
        const { email, password } = req.body;
        console.log (req.body);
        const user = await Employe.findOne({ email });
        if (!user) {
            console.log('req.body');
            return res
                .status(400)
                .json({ msg: "User with this email does not exist!" });
        }


        if (!user.authenticate(password)) {
            console.log('pssss')
            return res.status(400).json({ msg: "Incorrect password." });

        }

        const token = jwt.sign({ id: user.id }, "passwordKey");
        return    res.status(200).json({ status: 200,data:token });
      //  return res.json({ token, firstName: user.firstName, lastName : user.lastName, email : user.email, userName : user.userName});
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

exports.verifyToken = async function (req, res) {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);
        const verified = jwt.verify(token, "passwordKey");
        if (!verified) return res.json(false);
        const user = await Employe.findById(verified.id);
        if (!user) return res.json(false);
        return res.json(true);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// get itinerary for a specific employee
exports.getEmployeeItinerary = async function (req, res) {
    const { employeeId } = req.params;
  
    try {
      const employee = await Employe.findById(employeeId).select("itinerary");
      
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
  
      res.status(200).json({ status: 200, data: employee.itinerary });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  };

  exports.reserve = async function (req, res) {
    const { dateTime, itineraryId, stationId, places } = req.body;
  
    try {
      // Check if the date, itinerary, and station exist
      const itinerary = await Itinerary.findById(itineraryId);
      const station = await Marker.findById(stationId);
      if (!itinerary || !station) {
        return res.status(400).json({ error: 'Invalid itinerary or station' });
      }
  
      // Check if there is a bus available at the specified date and time
      const bus = await Bus.findOne({ 
        itinerary: itineraryId, 
        startingTime: { $lte: dateTime }, 
        returnTime: { $gte: dateTime } 
      });
      if (!bus || bus.number_places < places) {
        return res.status(400).json({ error: 'No bus available at the specified date and time, or not enough places available' });
      }
  
      // If everything checks out, create the reservation and decrement the number of places
      const reservation = new Reservation({ date: dateTime, itinerary: itineraryId, station: stationId, places });
      await reservation.save();
  
      bus.number_places -= places;
      await bus.save();
  
      return res.status(200).json({ status: 200, data: reservation });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  