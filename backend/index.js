const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const parkingRoutes = require("./routes/parkingRoutes.js");

const connectDB = require("./config/db.js");
const scheduleJobs = require("./jobs/scheduler.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/hello", () => {
  console.log("I am happpyp");
});
// app.use("/api/parking", parkingRoutes);

app.use("/api/parking", parkingRoutes);

connectDB();

//Starts the cron job scheduler
scheduleJobs();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
