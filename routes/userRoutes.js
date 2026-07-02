
const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");

const {
  profile,
  updateProfile,
  searchUsers,
  getSavedVideos,
} = require("../controllers/userController");

// ================= PROFILE =================
router.get("/profile", protect, profile);

// ================= UPDATE PROFILE =================
router.put("/profile", protect, updateProfile);

// ================= SEARCH USERS =================
router.get("/search", searchUsers);

// ================= SAVED VIDEOS =================
router.get("/saved", protect, getSavedVideos);

// ================= PUBLIC USER PROFILE =================
// IMPORTANT: Ye route sabse LAST me hona chahiye
router.get("/:id", async (req, res) => {
  try {
    const User = require("../models/User");
    const Video = require("../models/Video");

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const videos = await Video.find({
      user: req.params.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      user,
      videos,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;

