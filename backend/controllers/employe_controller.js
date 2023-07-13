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
    const { Time, itineraryId, stationIds, employeeId } = req.body;

    // Verify itinerary
    const itinerary = await Itinerary.findOne({ _id: itineraryId });
    if (!itinerary) {
      return res.status(400).json({ message: "Invalid itinerary" });
    }

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
      employee: employee
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
//     const { startingTime, returnTime, itineraryId, stationIds, numberOfPlaces } = req.body;

//     // Verify startingTime and returnTime
//     const bus = await Bus.findOne({ startingTime: startingTime, returnTime: returnTime });
//     if (!bus) {
//       return res.status(400).json({ message: "Invalid startingTime or returnTime" });
//     }

//     // Verify itinerary
//     const itinerary = await Itinerary.findOne({ _id: itineraryId });
//     if (!itinerary) {
//       return res.status(400).json({ message: "Invalid itinerary" });
//     }

//     // Verify stations
//     const stations = await Marker.find({ _id: { $in: stationIds } });
//     if (stations.length !== stationIds.length) {
//       return res.status(400).json({ message: "Invalid stations" });
//     }

//     // Verify number of places
//     if (bus.number_places < numberOfPlaces) {
//       return res.status(400).json({ message: "Not enough places available" });
//     }

//     // Make reservation and decrement number of places
//     bus.number_places -= numberOfPlaces;
//     await bus.save();

//     return res.status(200).json({ message: "Reservation successful" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
  

  // exports.makeReservation = async function (bus, employe) {
  //     // Check if busId is a valid ObjectId
  // if (!mongoose.Types.ObjectId.isValid(bus)) {
  //   throw new Error('Invalid busId');
  // }
  //   // Find the bus
  //   const buses = await Bus.findById(bus);
  //   if (!buses) {
  //     throw new Error('Bus not found');
  //   }
  
  //   // Check if the bus has available places
  //   if (buses.number_places <= 0) {
  //     throw new Error('No available places in this bus');
  //   }
  
  //   // Check if the bus has a valid itinerary
  //   if (!buses.itinerary) {
  //     throw new Error('Bus does not have a valid itinerary');
  //   }
  
  //   // Check if the bus has startingTime and returnTime
  //   if (!buses.startingTime || !buses.returnTime) {
  //     throw new Error('Bus does not have a valid startingTime or returnTime');
  //   }
  
  //   // If everything is okay, create a new reservation
  //   const reservation = new Reservation({
  //     buses: bus,
  //     user: employe,
  //   });
  
  //   // Decrement the number of places in the bus
  //   buses.number_places -= 1;
  //   await buses.save();
  
  //   // Save the reservation
  //   await reservation.save();
  
  //   return reservation;
  // };
  
  
  // exports.makeReservation = async (employeId, busStartingTime, busReturnTime, itineraryId, stationIds, placesRequested) => {
  //   try {
  //     // Check if the bus is available
  //     const busAvailability = await Bus.findOne({
  //       startingTime: busStartingTime,
  //       returnTime: busReturnTime,
  //     });
  
  //     if (!busAvailability) {
  //       return 'Bus not available';
  //     }
  
  //     // Check if the itinerary is available
  //     const itineraryAvailability = await Itinerary.findById(itineraryId);
  
  //     if (!itineraryAvailability) {
  //       return 'Itinerary not available';
  //     }
  
  //     // Check if all stations are available
  //     const stationAvailabilityPromises = stationIds.map(async (stationId) => {
  //       const station = await Marker.findById(stationId);
  //       return !!station; // Returns true if the station exists
  //     });
  
  //     const stationAvailability = await Promise.all(stationAvailabilityPromises);
  //     const allStationsAvailable = stationAvailability.every((station) => station);
  
  //     if (!allStationsAvailable) {
  //       return 'Some stations are not available';
  //     }
  
  //     // Check if the requested number of places is available
  //     const availablePlaces = busAvailability.number_places;
  
  //     if (availablePlaces < placesRequested) {
  //       return 'Requested number of places not available';
  //     }
  
  //     // Make the reservation and decrement the number of places in the bus
  //     busAvailability.number_places -= placesRequested;
  //     await busAvailability.save();
  
  //     // Perform other reservation-related tasks here
  
  //     return 'Reservation made successfully';
  //   } catch (error) {
  //     return 'An error occurred during the reservation process';
  //   }
  // };
  
    
   