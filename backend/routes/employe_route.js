const express = require("express");

const router = express.Router();
const employe_controller = require("../controllers/employe_controller");

router.post("/signin",employe_controller.signin);

module.exports = router;