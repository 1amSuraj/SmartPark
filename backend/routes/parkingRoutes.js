const express = require("express");
const router = express.Router();

const {
  createParkingEntry,
  handlePaymentWebhook,
  handleGupshupWebhook,
  getAllParkingEntries,
  deletingVehicleEntries,
} = require("../controllers/parkingController");

router.post("/", createParkingEntry);
router.post("/webhook", handlePaymentWebhook); // Add this route for Razorpay webhook
router.post("/gupshup-webhook", handleGupshupWebhook);
router.get("/", getAllParkingEntries);
router.delete("/exit", deletingVehicleEntries);

module.exports = router;
