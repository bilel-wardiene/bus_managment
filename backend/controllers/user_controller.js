const express = require("express");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Employe = require("../models/employe");
const Itinerary = require("../models/itinerary");
const Marker = require("../models/marker");
const Reservation = require("../models/reservation");
const Bus = require("../models/bus");



// SIGN UP
exports.signup = async function (req, res) {
    try {
        const { userName, email, password, firstName, lastName } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ msg: "access denied" });
        }

        let user = new User({
            firstName,
            lastName,
            email,
            password,
            userName,
        });
         await user.save();
res.status(200).json({ status: 200,data:user });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// Sign In 

exports.signin = async function (req, res) {
    try {
        const { email, password } = req.body;
        console.log (req.body);
        const user = await User.findOne({ email });
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
        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
        return res.json(true);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}



exports.getAllReservation = async function (req, res) {
  try {
    const reservations = await Reservation.find()
      .populate({
        path: 'employee',
        select: 'userName',
      })
      .populate({
        path: 'stations',
        select: 'name',
      })
      .populate({
        path: 'itinerary',
        select: 'name',
       
      })
      .exec();

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.deleteReservation = async function (req, res) {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Increment the number of places for the associated bus
    const bus = await Bus.findById(reservation.busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    bus.number_places += 1;
    await bus.save();

    return res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

// get all employe
exports.getAllEmploye = async function (req, res) {
    try {
        const employe = await Employe.find().populate({
          path : "itinerary",
        });
        res.status(200).json({ status: 200, data: employe });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

// Function to get an employee by ID
exports.getEmployeeById = async function (req, res) {
  const { id } = req.params;

  try {
    const employee = await Employe.findById(id).populate('itinerary');
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json({ status: 200, data: employee });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

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

  
// add employe
exports.addEmploye = async function (req, res) {
  try {
    const employe = await Employe.create(req.body);
    console.log("dldldldldl", req.body);
    res.status(200).json({ status: 200, data: employe });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};



// delete employe
exports.deleteEmploye = async function (req, res) {
  try {
    const employe = await Employe.findByIdAndDelete(req.params.id);
    if (!employe) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      res.status(200).json({ message: 'Employee deleted successfully' });
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};


// delete employees
exports.deleteEmployees = async function (req, res) {
    try {
    const { employeeIds } = req.body;

    // Convert employeeIds to an array if it's not already
    const ids = Array.isArray(employeeIds) ? employeeIds : [employeeIds];
    
    const result = await Employe.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Employees not found' });
    }

    res.status(200).json({ message: 'Employees deleted successfully' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};




  // update employe
  exports.updateEmploye = async function (req, res) {
    try {
      const employe = await Employe.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!employe) {
        res.status(404).json({ error: 'Employee not found' });
      } else {
        res.status(200).json({ status: 200, data: employe });
      }
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  };

