
const User = require("../models/User");
const Video = require("../models/Video");

// ================= PROFILE =================
const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const videos = await Video.find({
      user: req.user.id,
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
};

// ================= UPDATE PROFILE =================
const updateProfile = async (req, res) => {
  try {
    const { username, bio, profilePic } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.profilePic = profilePic || user.profilePic;

    await user.save();

    res.json({
      success: true,
      message: "Profile Updated",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= SEARCH USERS =================
const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.q || "";

    const users = await User.find({
      username: {
        $regex: keyword,
        $options: "i",
      },
    }).select("username profilePic");

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= FOLLOW =================
const followUser = async (req, res) => {
  res.json({
    success: true,
    message: "Follow feature coming next",
  });
};

// ================= UNFOLLOW =================
const unfollowUser = async (req, res) => {
  res.json({
    success: true,
    message: "Unfollow feature coming next",
  });
};

const getSavedVideos = async (req, res) => {
  try {
    const User = require("../models/User");

    const user = await User.findById(req.user.id)
      .populate({
        path: "savedVideos",
        populate: {
          path: "user",
          select: "username profilePic",
        },
      });

    res.json({
      success: true,
      videos: user.savedVideos,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


module.exports = {
  profile,
  updateProfile,
  searchUsers,
  followUser,
  unfollowUser,
  getSavedVideos,
};

