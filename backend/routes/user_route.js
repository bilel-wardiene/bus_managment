const express = require("express");
const User = require("../models/user");
const router = express.Router();
const user_controller = require("../controllers/user_controller");
const user = require("../models/user");
router.post("/signup",user_controller.signup);
router.post("/signin",user_controller.signin);
router.post("verifyToken",user_controller.verifyToken);

module.exports = router;

