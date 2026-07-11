const Notification = require("../models/Notification");
const cloudinary = require("../config/cloudinary");
const Video = require("../models/Video");

// ================= UPLOAD VIDEO =================
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a video",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "nova-videos",
    });

    const hashtags = req.body.hashtags
      ? req.body.hashtags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
      : [];

    const video = await Video.create({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
      hashtags,
      category: req.body.category,
      visibility: req.body.visibility || "public",
      videoUrl: result.secure_url,
    });

    res.status(201).json({
      success: true,
      message: "Video Uploaded Successfully",
      video,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET FEED =================
const getFeed = async (req, res) => {
  try {
    const videos = await Video.find({
      visibility: "public",
    })
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= LIKE VIDEO =================
const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    const userId = req.user.id;

    if (video.likes.includes(userId)) {
      video.likes.pull(userId);
    } else {
      video.likes.push(userId);
    }

    await video.save();

    if (video.user.toString() !== req.user.id) {
      await Notification.create({
        sender: req.user.id,
        receiver: video.user,
        type: "like",
        video: video._id,
      });
    }

    res.json({
      success: true,
      likes: video.likes.length,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
// ================= ADD COMMENT =================
const addComment = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    video.comments.push({
      user: req.user.id,
      text: req.body.text,
    });

    await video.save();

    if (video.user.toString() !== req.user.id) {
      await Notification.create({
        sender: req.user.id,
        receiver: video.user,
        type: "comment",
        video: video._id,
      });
    }

    const updatedVideo = await Video.findById(video._id)
      .populate("comments.user", "username profilePic");

    res.status(200).json({
      success: true,
      comments: updatedVideo.comments,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= DELETE VIDEO =================
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    if (video.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await Video.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Video Deleted Successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= ADD VIEW =================
const addView = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    video.views += 1;

    await video.save();

    res.json({
      success: true,
      views: video.views,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= SAVE VIDEO =================
const saveVideo = async (req, res) => {
  try {
    const User = require("../models/User");

    const user = await User.findById(req.user.id);

    const videoId = req.params.id;

    if (user.savedVideos.includes(videoId)) {
      user.savedVideos.pull(videoId);

      await user.save();

      return res.json({
        success: true,
        saved: false,
      });
    }

    user.savedVideos.push(videoId);

    await user.save();

    res.json({
      success: true,
      saved: true,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= GET MY VIDEOS =================

const getMyVideos = async (req, res) => {
  try {

    const videos = await Video.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .populate("user", "username profilePic");

    res.status(200).json({
      success: true,
      count: videos.length,
      videos,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ================= EXPORTS =================
module.exports = {
  uploadVideo,
  getFeed,
  likeVideo,
  addComment,
  deleteVideo,
  addView,
  saveVideo,
  getMyVideos,
};