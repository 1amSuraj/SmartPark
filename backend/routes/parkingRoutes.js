const express = require("express");
const router = express.Router();

const { createParkingEntry } = require("../controllers/parkingController");

router.post("/", createParkingEntry);

module.exports = router;
