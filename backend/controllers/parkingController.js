const Parking = require("../models/Parking");
const Stats = require("../models/Stats");

function getTodayMidnightUTC() {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  return now;
}

async function updateStatsOnEntry() {
  const today = getTodayMidnightUTC();
  let stats = await Stats.findOne({ date: today });
  if (!stats) {
    stats = await Stats.create({ date: today });
  }
  stats.entriesToday += 1;
  await stats.save();
}

async function updateStatsOnPayment(amount) {
  const today = getTodayMidnightUTC();
  let stats = await Stats.findOne({ date: today });
  if (!stats) {
    stats = await Stats.create({ date: today });
  }
  stats.totalPaidToday += amount;
  await stats.save();
}

const { sendWhatsAppMessage } = require("../services/whatsappService.js");
const { generatePaymentLink } = require("../services/paymentService.js");

const createParkingEntry = async (req, res) => {
  try {
    const { vehicleNo, vehicleType, phone, parkingDuration } = req.body;

    const amount = parkingDuration * 30;

    const paymentLink = await generatePaymentLink(
      amount,
      phone,
      vehicleNo,
      parkingDuration
    );

    const entry = await Parking.create({
      vehicleNo,
      vehicleType,
      phone,
      parkingDuration,
      paymentLinkId: paymentLink.id,
    });
    await updateStatsOnEntry();

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
    console.log(payload);

    if (payload.event === "payment_link.paid") {
      const paymentLinkId = payload.payload.payment_link.entity.id;
      const paidAmount = payload.payload.payment_link.entity.amount_paid / 100; // Convert from paise to INR
      await updateStatsOnPayment(paidAmount);

      const parkingEntry = await Parking.findOne({ paymentLinkId });

      if (!parkingEntry) {
        return res.status(404).json({ message: "Parking entry not found" });
      }
      parkingEntry.firstPayment = true;

      parkingEntry.paymentStatus = "paid";
      parkingEntry.totalAmount += paidAmount; // Use the amount from Razorpay webhook
      parkingEntry.updatedDuration += parkingEntry.extraDuration;

      await parkingEntry.save();

      const message = `Thank you for your payment of ₹${paidAmount}. Your payment for vehicle ${parkingEntry.vehicleNo} has been successfully received.`;
      await sendWhatsAppMessage(parkingEntry.phone, message);

      console.log(
        `Payment status updated for vehicle ${parkingEntry.vehicleNo}. Total Amount Paid: ₹${paidAmount}`
      );

      res.status(200).json({
        message: "Payment status updated and total amount recorded.",
        parkingEntry,
      });
    } else {
      res.status(400).json({ message: "Unhandled event type" });
    }
  } catch (error) {
    console.error("Error handling Razorpay webhook:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const handlePayMessage = async (req, res) => {
  try {
    const { phone } = req.body;

    const parkingEntry = await Parking.findOne({ phone });
    if (!parkingEntry) {
      return res
        .status(404)
        .json({ message: "No parking entry found for this user." });
    }
    // Calculate total duration and extra duration
    const currentTime = new Date();
    const entryTime = new Date(parkingEntry.entryTime);
    const totalDuration = Math.ceil(
      (currentTime - entryTime) / (1000 * 60 * 60)
    ); // Convert milliseconds to hours
    const extraDuration = totalDuration - parkingEntry.updatedDuration;

    // Handle case where payment is pending but no extra charges apply
    if (parkingEntry.paymentStatus === "pending" && extraDuration <= 0) {
      return res.status(200).json({
        message: "No extra charges. User just needs to pay the normal bill.",
      });
    }

    // Calculate charges
    const normalBill = parkingEntry.parkingDuration * 30; // 30 INR per hour

    const extraCharges = extraDuration > 0 ? extraDuration * 40 : 0; // 40 INR per extra hour
    // parkingEntry.firstPayment = true;

    const totalAmount =
      parkingEntry.firstPayment === true
        ? extraCharges
        : normalBill + extraCharges;

    // If no extra charges and payment is already made, return early
    if (totalAmount === 0) {
      return res
        .status(200)
        .json({ message: "No extra charges. User has already paid." });
    }

    const paymentLink = await generatePaymentLink(
      totalAmount,
      parkingEntry.phone,
      parkingEntry.vehicleNo,
      1
    );

    //Update the database with the new payment link ID
    parkingEntry.paymentLinkId = paymentLink.id;
    parkingEntry.paymentStatus = "pending";
    parkingEntry.extraDuration = extraDuration;
    await parkingEntry.save();

    // Send WhatsApp message with the new payment link
    const message =
      parkingEntry.firstPayment === true
        ? `You have stayed beyond your booked duration. Vehicle No: ${parkingEntry.vehicleNo}. Extra Duration: ${extraDuration} hours. Extra Charges: ₹${extraCharges}. Please complete your payment here: ${paymentLink.short_url}`
        : `Your updated parking bill is ready. Vehicle No: ${parkingEntry.vehicleNo}. Total Amount: ₹${totalAmount}. Please complete your payment here: ${paymentLink.short_url}`;
    await sendWhatsAppMessage(parkingEntry.phone, message);

    res.status(200).json({
      message: "New payment link sent to the user and updated in the database.",
      paymentLink,
    });
  } catch (err) {
    console.error("Error handling 'pay' message:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const handleGupshupWebhook = async (req, res) => {
  try {
    const { type, payload } = req.body;

    if (type === "message") {
      const { text } = payload.payload;
      const { phone } = payload.sender;

      console.log(`Received message: "${text}" from phone: ${phone}`);

      if (text.toLowerCase() === "pay") {
        console.log(`Triggering handlePayMessage for phone: ${phone}`);

        req.body.phone = phone; // Setting phone number in req
        await handlePayMessage(req, res);
        return;
      }
    }

    res.status(200).json({ message: "Message received but not processed." });
  } catch (error) {
    console.error("Error handling Gupshup webhook:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllParkingEntries = async (req, res) => {
  try {
    const entries = await Parking.find();
    res.status(200).json(entries);
  } catch (err) {
    console.error("Error fetching parking entries:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deletingVehicleEntries = async (req, res) => {
  const { vehicleNo } = req.body;
  if (!vehicleNo) {
    return res
      .status(400)
      .json({ message: "vehicleNo is required in the request body." });
  }

  try {
    const parkingEntry = await Parking.findOne({ vehicleNo });
    if (!parkingEntry) {
      return res
        .status(404)
        .json({ message: "No entry found for this vehicle number" });
    }
    const phone = parkingEntry.phone;

    const currentTime = new Date();
    const entryTime = new Date(parkingEntry.entryTime);
    const totalDuration = Math.ceil(
      (currentTime - entryTime) / (1000 * 60 * 60)
    ); // Convert milliseconds to hours
    const extraDuration = totalDuration - parkingEntry.updatedDuration;

    if (parkingEntry.paymentStatus === "pending" && extraDuration <= 0) {
      const message =
        "Pay from the above link or check you sms for the payment request.";
      await sendWhatsAppMessage(phone, message);
      return res.status(203).json({
        message: "Pending bill message sent to user",
      });
    }
    const normalBill = parkingEntry.parkingDuration * 30; // 30 INR per hour

    const extraCharges = extraDuration > 0 ? extraDuration * 40 : 0; // 40 INR per extra hour

    const totalAmount =
      parkingEntry.firstPayment === true
        ? extraCharges
        : normalBill + extraCharges;

    if (totalAmount === 0) {
      try {
        await Parking.findOneAndDelete({ vehicleNo });
        return res.status(200).json({ message: "Entry deleted successfully." });
      } catch (err) {
        console.error("Error deleting parking entry:", err);
        res.status(500).json({ message: "Server error" });
      }
    }
    const paymentLink = await generatePaymentLink(
      totalAmount,
      parkingEntry.phone,
      parkingEntry.vehicleNo,
      1
    );
    parkingEntry.paymentLinkId = paymentLink.id;
    parkingEntry.paymentStatus = "pending";
    parkingEntry.extraDuration = extraDuration;
    await parkingEntry.save();

    const message =
      parkingEntry.firstPayment === true
        ? `You have stayed beyond your booked duration. Vehicle No: ${parkingEntry.vehicleNo}. Extra Duration: ${extraDuration} hours. Extra Charges: ₹${extraCharges}. Please complete your payment here: ${paymentLink.short_url}`
        : `Your updated parking bill is ready. Vehicle No: ${parkingEntry.vehicleNo}. Total Amount: ₹${totalAmount}. Please complete your payment here: ${paymentLink.short_url}`;
    await sendWhatsAppMessage(parkingEntry.phone, message);
    res.status(203).json({
      message: "New payment link sent to the user, payment is still pending",
      paymentLink,
    });
  } catch (err) {
    console.error("Error deleting:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getStats = async (req, res) => {
  try {
    const today = getTodayMidnightUTC();

    const todayStats = (await Stats.findOne({ date: today })) || {
      totalPaidToday: 0,
      entriesToday: 0,
    };

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setUTCDate(today.getUTCDate() - 6);
    const monthAgo = new Date(today);
    monthAgo.setUTCDate(today.getUTCDate() - 29);

    const stats7 = await Stats.aggregate([
      { $match: { date: { $gte: sevenDaysAgo, $lte: today } } },
      { $group: { _id: null, total: { $sum: "$totalPaidToday" } } },
    ]);
    const stats30 = await Stats.aggregate([
      { $match: { date: { $gte: monthAgo, $lte: today } } },
      { $group: { _id: null, total: { $sum: "$totalPaidToday" } } },
    ]);
    res.json({
      totalPaidToday: todayStats.totalPaidToday || 0,
      totalPaid7Days: stats7[0]?.total || 0,
      totalPaid30Days: stats30[0]?.total || 0,
      entriesToday: todayStats.entriesToday || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

module.exports = {
  createParkingEntry,
  handlePaymentWebhook,
  handlePayMessage,
  handleGupshupWebhook,
  getAllParkingEntries,
  deletingVehicleEntries,
  getStats,
};
