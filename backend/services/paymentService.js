const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generatePaymentLink = async (
  amount,
  phone,
  vehicleNo,
  parkingDuration
) => {
  try {
    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      accept_partial: false,
      description: `Parking fee for vehicle ${vehicleNo}`,
      customer: {
        name: "Parking User", // You can customize this if you have user details
        contact: phone,
      },
      notify: {
        sms: true,
        email: false,
      },
      reminder_enable: true,
      expire_by: Math.floor(Date.now() / 1000) + parkingDuration * 60 * 60,
    };

    const response = await razorpay.paymentLink.create(options);
    console.log("Payment link generated and sent");
    return response; // Return the payment link
  } catch (error) {
    console.error("Error generating payment link:", error);
    throw error;
  }
};

module.exports = { generatePaymentLink };
