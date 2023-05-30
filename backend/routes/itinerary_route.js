const express = require("express");

const router = express.Router();
const itinerary_controller = require("../controllers/itinerary_controller");

router.post("/addItinerary",itinerary_controller.createItinerary);
router.delete("/deleteItinerary/:id",itinerary_controller.deleteItinerary);
router.delete("/deleteItineraries",itinerary_controller.deleteItineraries);
router.get("/getAllItinerary",itinerary_controller.getAllItineraries);
router.put("/updateItinerary/:id",itinerary_controller.updateItinerary);

module.exports = router;