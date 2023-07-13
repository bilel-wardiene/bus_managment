const express = require("express");
const User = require("../models/user");
const router = express.Router();
const user_controller = require("../controllers/user_controller");
const user = require("../models/user");
router.post("/signup",user_controller.signup);
router.post("/signin",user_controller.signin);
router.post("verifyToken",user_controller.verifyToken);
router.post("/addEmploye",user_controller.addEmploye);


router.get("/getAllEmploye",user_controller.getAllEmploye);
router.delete("/deleteEmploye/:id",user_controller.deleteEmploye);
router.delete("/deleteEmployees", user_controller.deleteEmployees);
router.put("/updateEmploye/:id",user_controller.updateEmploye);


module.exports = router;

