const express = require("express");

const router = express.Router();
const employe_controller = require("../controllers/employe_controller");

router.post("/signin",employe_controller.signin);
router.get('/:employeeId', employe_controller.getEmployeeItinerary);

router.post("/reserve",employe_controller.reservation);
module.exports = router;