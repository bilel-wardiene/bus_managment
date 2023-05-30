const express = require("express");

const router = express.Router();
const bus_controller = require("../controllers/bus_controller");
router.post("/addBus",bus_controller.createBus);
router.delete("/deleteBus/:id",bus_controller.deleteBus);
router.delete("/deleteBuses", bus_controller.deleteBuses);
router.get("/getAllBus",bus_controller.getAllBuses);
router.put("/updateBus/:id",bus_controller.updateBus);

module.exports = router;