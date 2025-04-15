const cron = require("node-cron");
const Parking = require("../models/Parking");
const { sendWhatsAppMessage } = require("../services/whatsappService");

// Schedule a job to run every minute
const scheduleJobs = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Running scheduled job to check parking durations...");

    try {
      // Get the current time
      const currentTime = new Date();

      // Find parking entries where the duration has ended and the notification has not been sent
      const expiredEntries = await Parking.find({
        notificationSent: false,
        $expr: {
          $lte: [
            {
              $add: [
                "$entryTime",
                { $multiply: ["$parkingDuration", 60 * 60 * 1000] },
              ],
            },
            currentTime,
          ],
        },
      });

      // Send WhatsApp messages for each expired entry
      for (const entry of expiredEntries) {
        const message = `Your parking duration of ${entry.parkingDuration} hours has ended. You will now be charged a penalty based on your exit time.`;
        await sendWhatsAppMessage(entry.phone, message);

        // Mark the notification as sent
        entry.notificationSent = true;
        await entry.save();

        console.log(
          `Notification sent to ${entry.phone} for vehicle ${entry.vehicleNo}`
        );
      }
    } catch (error) {
      console.error("Error running scheduled job:", error);
    }
  });
};

module.exports = scheduleJobs;
