const express = require("express");

const router = express.Router();
const marker_controller = require("../controllers/marker_controller");

router.post("/addMarker",marker_controller.addMarker);
router.delete("/deleteMarker/:id",marker_controller.deleteMarker);
router.get("/getAllMarker",marker_controller.getAllMarkers);
router.put("/updateMarker/:id",marker_controller.updateMarker);

module.exports = router;