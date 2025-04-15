const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({
  vehicleNo: { type: String, required: true },
  vehicleType: { type: String, required: true },
  phone: { type: String, required: true },
  parkingDuration: { type: Number, required: true }, // in hours
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date }, // New field to store the exit time
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  paymentLinkId: { type: String },
  totalAmount: { type: Number, default: 0 }, // New field to store the total amount
  notificationSent: { type: Boolean, default: false }, // New field to track if the notification has been sent
});

module.exports = mongoose.model("Parking", parkingSchema);
