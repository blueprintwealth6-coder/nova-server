const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const videoRoutes = require("./routes/videoRoutes");
const followRoutes = require("./routes/followRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Middlewares - CORS configuration updated to fix the Vercel error
const allowedOrigins = [
  "https://vercel.app", // Aapki Vercel live website
  "http://localhost:3000"                  // Local development / testing ke liye
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Agar request allowed origins se hai ya server-to-server (no origin) hai
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS policy"));
      }
    },
    credentials: true, // Login tokens, authorization headers aur cookies allow karne ke liye
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// Main API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/notification", notificationRoutes);

// Base Home Route
app.get("/", (req, res) => {
  res.send("NOVA Backend Running 🚀");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
