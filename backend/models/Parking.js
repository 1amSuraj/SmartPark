const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({
  vehicleNo: { type: String, required: true },
  vehicleType: { type: String, required: true },
  phone: { type: String, required: true },
  parkingDuration: { type: Number, required: true }, // in hours
  entryTime: { type: Date, default: Date.now },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  paymentLinkId: { type: String },
});

module.exports = mongoose.model("Parking", parkingSchema);
