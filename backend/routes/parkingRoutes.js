const express = require("express");
const router = express.Router();

const {
  createParkingEntry,
  handlePaymentWebhook,
  handleGupshupWebhook,
  getAllParkingEntries,
  deletingVehicleEntries,
  getStats,
} = require("../controllers/parkingController");

router.post("/", createParkingEntry);
router.post("/webhook", handlePaymentWebhook); // Add this route for Razorpay webhook
router.post("/gupshup-webhook", handleGupshupWebhook);
router.get("/", getAllParkingEntries);
router.delete("/exit", deletingVehicleEntries);
router.get("/stats", getStats);

module.exports = router;
