const Parking = require("../models/Parking");
const { sendWhatsAppMessage } = require("../services/whatsappService.js");
const { generatePaymentLink } = require("../services/paymentService.js");

const createParkingEntry = async (req, res) => {
  try {
    const { vehicleNo, vehicleType, phone, parkingDuration } = req.body;

    // Calculate the amount (e.g., 50 INR per hour)
    const amount = parkingDuration * 50;

    // Generate payment link
    const paymentLink = await generatePaymentLink(amount, phone, vehicleNo);
    // Save parking entry to MongoDB
    const entry = await Parking.create({
      vehicleNo,
      vehicleType,
      phone,
      parkingDuration,
      paymentLinkId: paymentLink.id, // Save Razorpay payment link ID
    });

    // Send WhatsApp message with payment link
    const message = `Your parking entry has been created. Vehicle No: ${vehicleNo}, Duration: ${parkingDuration} hours. Please complete your payment here: ${paymentLink.short_url}`;
    await sendWhatsAppMessage(phone, message);

    res.status(201).json({ message: "Entry recorded", entry, paymentLink });
  } catch (err) {
    console.error("Error creating parking entry:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const handlePaymentWebhook = async (req, res) => {
  try {
    const payload = req.body;

    // Verify the event type
    if (payload.event === "payment_link.paid") {
      const paymentLinkId = payload.payload.payment_link.entity.id;

      // Update payment status in the database
      const updatedEntry = await Parking.findOneAndUpdate(
        { paymentLinkId }, // Assuming you store Razorpay's payment link ID in your database
        { paymentStatus: "paid" },
        { new: true }
      );

      if (!updatedEntry) {
        return res.status(404).json({ message: "Parking entry not found" });
      }

      console.log(
        `Payment status updated for vehicle ${updatedEntry.vehicleNo}`
      );
      res.status(200).json({ message: "Payment status updated", updatedEntry });
    } else {
      res.status(400).json({ message: "Unhandled event type" });
    }
  } catch (error) {
    console.error("Error handling Razorpay webhook:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createParkingEntry,
  handlePaymentWebhook,
};
