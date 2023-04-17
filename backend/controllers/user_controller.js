const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Employe = require("../models/employe");



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

// add employe
exports.addEmploye = async function (req, res) {
    try {
      const employe = await Employe.create(req.body);
      res.status(200).json({ status: 200, data: employe });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  };
 
  

// get all employe
exports.getAllEmploye = async function (req, res) {
    try {
        const employe = await Employe.find({});
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

  // delete list of employe
  exports.deleteEmployees = async function (req, res) {
    try {
      const employeeIds = req.body.employeeIds; // get the array of employee IDs from the request body
      const result = await Employe.deleteMany({ _id: { $in: employeeIds } }); // delete all employees with the specified IDs
      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'No employees were deleted' });
      } else {
        res.status(200).json({ message: 'Employees deleted successfully' });
      }
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
  
  
  