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
  totalAmount: { type: Number, default: 0 },
  notificationSent: { type: Boolean, default: false },
  firstPayment: { type: Boolean, default: false },
  updatedDuration: { type: Number },
  extraDuration: { type: Number, default: 0 },
});

// Pre-save hook to set updatedDuration to parkingDuration if not explicitly set
parkingSchema.pre("save", function (next) {
  if (!this.updatedDuration) {
    this.updatedDuration = this.parkingDuration;
  }
  next();
});

module.exports = mongoose.model("Parking", parkingSchema);
