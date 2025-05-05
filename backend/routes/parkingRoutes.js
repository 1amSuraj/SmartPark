const express = require("express");
const router = express.Router();

const {
  createParkingEntry,
  handlePaymentWebhook,
  handleGupshupWebhook,
  getAllParkingEntries,
} = require("../controllers/parkingController");

router.post("/", createParkingEntry);
router.post("/webhook", handlePaymentWebhook); // Add this route for Razorpay webhook
router.post("/gupshup-webhook", handleGupshupWebhook);
router.get("/", getAllParkingEntries);

module.exports = router;
