const Parking = require("../models/Parking");

const createParkingEntry = async (req, res) => {
  try {
    const { vehicleNo, vehicleType, phone, parkingDuration } = req.body;

    const entry = await Parking.create({
      vehicleNo,
      vehicleType,
      phone,
      parkingDuration,
    });

    // TODO: Trigger WhatsApp + payment link here

    res.status(201).json({ message: "Entry recorded", entry });
  } catch (err) {
    console.error("Error creating parking entry:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createParkingEntry,
};
