const express = require("express");
const router = express.Router();

const {
  createParkingEntry,
  handlePaymentWebhook,
} = require("../controllers/parkingController");

router.post("/", createParkingEntry);
router.post("/webhook", handlePaymentWebhook); // Add this route for Razorpay webhook

module.exports = router;
