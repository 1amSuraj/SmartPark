const Parking = require("../models/Parking");
const { sendWhatsAppMessage } = require("../services/whatsappService.js");
const { generatePaymentLink } = require("../services/paymentService.js");

const createParkingEntry = async (req, res) => {
  try {
    const { vehicleNo, vehicleType, phone, parkingDuration } = req.body;

    // Save parking entry to MongoDB
    const entry = await Parking.create({
      vehicleNo,
      vehicleType,
      phone,
      parkingDuration,
    });

    // Calculate the amount (e.g., 50 INR per hour)
    const amount = parkingDuration * 50;

    // Generate payment link
    const paymentLink = await generatePaymentLink(amount, phone, vehicleNo);

    // Send WhatsApp message with payment link
    const message = `Your parking entry has been created. Vehicle No: ${vehicleNo}, Duration: ${parkingDuration} hours. Please complete your payment here: ${paymentLink}`;
    await sendWhatsAppMessage(phone, message);

    res.status(201).json({ message: "Entry recorded", entry, paymentLink });
  } catch (err) {
    console.error("Error creating parking entry:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createParkingEntry,
};
