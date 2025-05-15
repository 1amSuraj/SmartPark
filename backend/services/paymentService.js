const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Replace with your Razorpay Key Secret
});

const generatePaymentLink = async (
  amount,
  phone,
  vehicleNo,
  parkingDuration
) => {
  try {
    const options = {
      amount: amount * 100, // Amount in paise (e.g., 500 INR = 50000 paise)
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
      // expire_by: Math.floor(Date.now() / 1000) + 3600,
    };

    const response = await razorpay.paymentLink.create(options);
    // console.log("Payment link generated:", response);
    return response; // Return the payment link
  } catch (error) {
    console.error("Error generating payment link:", error);
    throw error;
  }
};

module.exports = { generatePaymentLink };
