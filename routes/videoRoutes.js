const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  uploadVideo,
  getFeed,
  likeVideo,
  addComment,
  deleteVideo,
  addView,
  saveVideo,
  getMyVideos,
} = require("../controllers/videoController");

// Upload Video
router.post("/upload", protect, upload.single("video"), uploadVideo);

// Feed & My Videos
router.get("/feed", getFeed);
router.get("/my-videos", protect, getMyVideos); // Bug fixed: 'auth' changed to 'protect'

// Like / Unlike
router.put("/like/:id", protect, likeVideo);

// Add Comment
router.post("/comment/:id", protect, addComment);

// Delete Video
router.delete("/delete/:id", protect, deleteVideo);

// Video Interaction (Views & Saves)
router.put("/view/:id", addView);
router.put("/save/:id", protect, saveVideo);

module.exports = router;