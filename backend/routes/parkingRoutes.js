const express = require("express");
const router = express.Router();

const {
  createParkingEntry,
  handlePaymentWebhook,
  handleGupshupWebhook,
} = require("../controllers/parkingController");

router.post("/", createParkingEntry);
router.post("/webhook", handlePaymentWebhook); // Add this route for Razorpay webhook
router.post("/gupshup-webhook", handleGupshupWebhook);

module.exports = router;
