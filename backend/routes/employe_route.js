const express = require("express");

const router = express.Router();
const employe_controller = require("../controllers/employe_controller");

router.post("/signin",employe_controller.signin);
router.get('/employees/:employeeId/itinerary', employe_controller.getEmployeeItinerary);
router.post('/reserve', employe_controller.reserve);
module.exports = router;