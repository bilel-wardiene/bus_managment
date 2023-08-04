const express = require("express");
const mongoose = require("mongoose");

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
    res.status(500).json({ error: "Failed to fetch employee itinerary" });
  }
};



exports.reservation = async (req, res) => {
  try {
    const { Time, itineraryId, stationIds, employeeId, busId } = req.body;

    // Verify itinerary 
    const itinerary = await Itinerary.findOne({ _id: itineraryId });
    if (!itinerary) {
      return res.status(400).json({ message: "Invalid itinerary" });
    }

    console.log("stationIds",stationIds);
    // Check if all stationIds exist in the specified itinerary
    const isValidStations = stationIds.every(stationId =>
      itinerary.stations.some(station => station._id.toString() === stationId)
    );
    if (!isValidStations) {
      return res.status(400).json({ message: "Invalid stations" });
    }

    // Verify employee
    const employee = await Employe.findOne({ _id: employeeId });
    if (!employee) {
      return res.status(400).json({ message: "Invalid employee" });
    }

    // Check if Time exists for the bus and matches startingTime or returnTime
    const bus = await Bus.findOne({
      _id: busId,
      $or: [
        { startingTime: Time },
        { returnTime: Time }
      ]
    });
    if (!bus) {
      return res.status(400).json({ message: "Invalid Time" });
    }

    // Verify if the itinerary exists for the bus
    if (bus.itinerary.toString() !== itineraryId) {
      return res.status(400).json({ message: "Invalid itinerary for the bus" });
    }

    // Verify number of places
    if (bus.number_places < 1) {
      return res.status(400).json({ message: "Not enough places available" });
    }

    // Make reservation and decrement number of places
    bus.number_places -= 1;
    await bus.save();

    // Create a new reservation document
    const reservation = new Reservation({
      Time: Time,
      itinerary: itinerary,
      stations: stationIds,
      numberOfPlaces: 1,
      employee: employee,
      busId: busId 
      
    });

    // Save the reservation to the database
    await reservation.save();

    return res.status(200).json(reservation);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// exports.reservation = async (req, res) => {
//   try {
//     const { Time, itineraryId, stationIds, employeeId } = req.body;

//     // Verify itinerary
//     const itinerary = await Itinerary.findOne({ _id: itineraryId });
//     if (!itinerary) {
//       return res.status(400).json({ message: "Invalid itinerary" });
//     }

//     // Check if all stationIds exist in the specified itinerary
//     const isValidStations = stationIds.every(stationId =>
//       itinerary.stations.some(station => station._id.toString() === stationId)
//     );
//     if (!isValidStations) {
//       return res.status(400).json({ message: "Invalid stations" });
//     }

//     // Verify employee
//     const employee = await Employe.findOne({ _id: employeeId });
//     if (!employee) {
//       return res.status(400).json({ message: "Invalid employee" });
//     }

//     // Check if Time exists for the bus and matches startingTime or returnTime
//     const bus = await Bus.findOne({
//       $or: [
//         { startingTime: Time },
//         { returnTime: Time }
//       ]
//     });
//     if (!bus) {
//       return res.status(400).json({ message: "Invalid Time" });
//     }

//     // Verify if the itinerary exists for the bus
//     if (bus.itinerary.toString() !== itineraryId) {
//       return res.status(400).json({ message: "Invalid itinerary for the bus" });
//     }

//     // Verify number of places
//     if (bus.number_places < 1) {
//       return res.status(400).json({ message: "Not enough places available" });
//     }

//     // Make reservation and decrement number of places
//     bus.number_places -= 1;
//     await bus.save();

//     // Create a new reservation document
//     const reservation = new Reservation({
//       Time: Time,
//       itinerary: itinerary,
//       stations: stationIds,
//       numberOfPlaces: 1,
//       employee: employee
//     });

//     // Save the reservation to the database
//     await reservation.save();

//     return res.status(200).json(reservation);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };






  
    
   