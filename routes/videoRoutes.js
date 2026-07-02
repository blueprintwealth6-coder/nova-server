
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
} = require("../controllers/videoController");

// Upload Video
router.post("/upload", protect, upload.single("video"), uploadVideo);

// Feed
router.get("/feed", getFeed);

// Like / Unlike
router.put("/like/:id", protect, likeVideo);

// Add Comment
router.post("/comment/:id", protect, addComment);

// Delete Video
router.delete("/delete/:id", protect, deleteVideo);

router.put("/view/:id", addView);

module.exports = router;

