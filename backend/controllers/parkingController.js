const Parking = require("../models/Parking");
const { sendWhatsAppMessage } = require("../services/whatsappService.js");
const { generatePaymentLink } = require("../services/paymentService.js");

const createParkingEntry = async (req, res) => {
  try {
    const { vehicleNo, vehicleType, phone, parkingDuration } = req.body;

    // Calculate the amount (e.g., 50 INR per hour)
    const amount = parkingDuration * 50;

    // Generate payment link
    const paymentLink = await generatePaymentLink(
      amount,
      phone,
      vehicleNo,
      parkingDuration
    );
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

// const handlePayMessage = async (req, res) => {
//   try {
//     const { phone } = req.body; // Assume the phone number is sent in the request body

//     // Find the parking entry for the user
//     const parkingEntry = await Parking.findOne({ phone, paymentStatus: "pending" });

//     if (!parkingEntry) {
//       return res.status(404).json({ message: "No pending payment found for this user." });
//     }

//     // Calculate the total duration the user has stayed
//     const currentTime = new Date();
//     const entryTime = new Date(parkingEntry.entryTime);
//     const totalDuration = Math.ceil((currentTime - entryTime) / (1000 * 60 * 60)); // Convert milliseconds to hours

//     // Calculate the extra charges
//     const extraDuration = totalDuration - parkingEntry.parkingDuration;
//     const normalBill = parkingEntry.parkingDuration * 50; // 50 INR per hour
//     const extraCharges = extraDuration > 0 ? extraDuration * 70 : 0; // 70 INR per extra hour
//     const totalAmount = normalBill + extraCharges;

//     // Expire the old payment link
//     parkingEntry.paymentLinkExpired = true;
//     parkingEntry.totalAmountDue = totalAmount;
//     await parkingEntry.save();

//     // Generate a new payment link
//     const paymentLink = await generatePaymentLink(totalAmount, parkingEntry.phone, parkingEntry.vehicleNo);

//     // Send WhatsApp message with the new payment link
//     const message = `Your updated parking bill is ready. Vehicle No: ${parkingEntry.vehicleNo}. Total Amount: ₹${totalAmount}. Please complete your payment here: ${paymentLink.short_url}`;
//     await sendWhatsAppMessage(parkingEntry.phone, message);

//     res.status(200).json({ message: "New payment link sent to the user.", paymentLink });
//   } catch (err) {
//     console.error("Error handling 'pay' message:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const handlePayMessage = async (req, res) => {
  try {
    const { phone } = req.body; // Assume the phone number is sent in the request body
    console.log(1);
    // Find the parking entry for the user
    const parkingEntry = await Parking.findOne({ phone });

    if (!parkingEntry) {
      return res
        .status(404)
        .json({ message: "No parking entry found for this user." });
    }
    console.log(2);

    if (parkingEntry.paymentStatus === "pending") {
      console.log(6.6);
      return res
        .status(200)
        .json({ message: "No extra charges. Payment is still unpaid." });
    }

    // Check if the user has already paid the normal bill
    if (parkingEntry.paymentStatus === "paid") {
      // Calculate the total duration the user has stayed
      const currentTime = new Date();
      const entryTime = new Date(parkingEntry.entryTime);
      const totalDuration = Math.ceil(
        (currentTime - entryTime) / (1000 * 60 * 60)
      ); // Convert milliseconds to hours
      console.log(3);
      // Calculate the extra charges
      const extraDuration = totalDuration - parkingEntry.parkingDuration;
      console.log(3.5);

      // if (extraDuration <= 0) {

      //     console.log(3.7);
      //     return res
      //       .status(200)
      //       .json({ message: "No extra charges. User has already paid." });
      //   }

      console.log(4);
      const extraCharges = extraDuration * 70; // 70 INR per extra hour

      // Calculate time in hours for expiry payment link
      const fullHourMark = entryTime + totalDuration * 60 * 60 * 1000;
      const timeLeft = Math.max(
        0,
        (fullHourMark - currentTime) / (1000 * 60 * 60)
      ); // in hours

      // Generate a new payment link for the extra charges
      const paymentLink = await generatePaymentLink(
        extraCharges,
        parkingEntry.phone,
        parkingEntry.vehicleNo,
        timeLeft
      );
      console.log(5);
      // Send WhatsApp message with the new payment link
      const message = `You have stayed beyond your booked duration. Vehicle No: ${parkingEntry.vehicleNo}. Extra Duration: ${extraDuration} hours. Extra Charges: ₹${extraCharges}. Please complete your payment here: ${paymentLink.short_url}`;
      await sendWhatsAppMessage(parkingEntry.phone, message);
      console.log(6);
      return res.status(200).json({
        message: "New payment link sent for extra charges.",
        paymentLink,
      });
    }

    // If the user has not paid the normal bill
    // Calculate the total duration the user has stayed
    const currentTime = new Date();
    const entryTime = new Date(parkingEntry.entryTime);
    const totalDuration = Math.ceil(
      (currentTime - entryTime) / (1000 * 60 * 60)
    ); // Convert milliseconds to hours

    // Calculate the normal bill and extra charges
    const extraDuration = totalDuration - parkingEntry.parkingDuration;
    console.log(extraDuration);
    const normalBill = parkingEntry.parkingDuration * 50; // 50 INR per hour
    const extraCharges = extraDuration > 0 ? extraDuration * 70 : 0; // 70 INR per extra hour
    const totalAmount = normalBill + extraCharges;

    // Expire the old payment link

    // parkingEntry.paymentLinkExpired = true;
    // parkingEntry.totalAmountDue = totalAmount;
    await parkingEntry.save();

    // Calculate time in hours for expiry payment link
    const fullHourMark = entryTime + totalDuration * 60 * 60 * 1000;
    const timeLeft = Math.max(
      0,
      (fullHourMark - currentTime) / (1000 * 60 * 60)
    ); // in hours

    // Generate a new payment link
    const paymentLink = await generatePaymentLink(
      // totalAmount,
      totalAmount,
      parkingEntry.phone,
      parkingEntry.vehicleNo,
      timeLeft
    );

    // Send WhatsApp message with the new payment link
    const message = `Your updated parking bill is ready. Vehicle No: ${parkingEntry.vehicleNo}. Total Amount: ₹${totalAmount}. Please complete your payment here: ${paymentLink.short_url}`;
    await sendWhatsAppMessage(parkingEntry.phone, message);

    res
      .status(200)
      .json({ message: "New payment link sent to the user.", paymentLink });
  } catch (err) {
    console.error("Error handling 'pay' message:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// const handleGupshupWebhook = async (req, res) => {
//   try {
//     const { type, payload } = req.body;
//     console.log(payload);
//     // Check if the incoming message is of type "message"
//     if (type === "message") {
//       const { payload, sender } = payload;
//       console.log()
//       // Check if the message text is "pay"
//       if (payload.text.toLowerCase() === "pay") {
//         console.log(`Received "pay" message from ${sender}`);

//         // Trigger the handlePayMessage function
//         req.body.phone = sender; // Set the phone number in the request body
//         await handlePayMessage(req, res);
//         return;
//       }
//     }

//     res.status(200).json({ message: "Message received but not processed." });
//   } catch (error) {
//     console.error("Error handling Gupshup webhook:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const handleGupshupWebhook = async (req, res) => {
  try {
    const { type, payload } = req.body;

    // Check if the incoming message is of type "message"
    if (type === "message") {
      const { text } = payload.payload; // Extract the text message
      const { phone } = payload.sender; // Extract the sender's phone number

      console.log(`Received message: "${text}" from phone: ${phone}`);

      // Check if the message text is "pay"
      if (text.toLowerCase() === "pay") {
        console.log(`Triggering handlePayMessage for phone: ${phone}`);

        // Trigger the handlePayMessage function
        req.body.phone = phone; // Set the phone number in the request body
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

module.exports = {
  createParkingEntry,
  handlePaymentWebhook,
  handlePayMessage,
  handleGupshupWebhook,
};
