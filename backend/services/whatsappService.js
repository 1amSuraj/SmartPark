const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const sendWhatsAppMessage = async (destination, message) => {
  const encodedParams = new URLSearchParams();
  encodedParams.set("message", JSON.stringify({ text: message, type: "text" }));
  encodedParams.set("channel", "whatsapp");
  encodedParams.set("source", process.env.GUPSHUP_SOURCE_NUMBER);
  encodedParams.set("destination", destination);
  encodedParams.set("src.name", "ParkingAutomation");
  encodedParams.set("disablePreview", "false");
  encodedParams.set("encode", "false");

  const options = {
    method: "POST",
    url: "https://api.gupshup.io/wa/api/v1/msg",
    headers: {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      apikey: process.env.GUPSHUP_API_KEY,
    },
    data: encodedParams,
  };

  try {
    const response = await axios.request(options);
    console.log("WhatsApp message sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
};

module.exports = { sendWhatsAppMessage };
