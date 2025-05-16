const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  totalPaidToday: { type: Number, default: 0 },
  totalPaid7Days: { type: Number, default: 0 },
  totalPaid30Days: { type: Number, default: 0 },
  entriesToday: { type: Number, default: 0 },
});

module.exports = mongoose.model("Stats", statsSchema);
