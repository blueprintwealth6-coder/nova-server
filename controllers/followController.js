
const Notification = require("../models/Notification");

const User = require("../models/User");

const followUser = async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    const otherUser = await User.findById(req.params.id);

    if (!otherUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (req.user.id === req.params.id) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const alreadyFollowing = me.following.includes(req.params.id);

    if (alreadyFollowing) {
      // Unfollow
      me.following.pull(req.params.id);
      otherUser.followers.pull(req.user.id);

      await me.save();
      await otherUser.save();

      return res.json({
        success: true,
        following: false,
      });
    }

    // Follow
    me.following.push(req.params.id);
    otherUser.followers.push(req.user.id);

    await me.save();
    await otherUser.save();
    
await Notification.create({
  sender: req.user.id,
  receiver: otherUser._id,
  type: "follow",
});



    res.json({
      success: true,
      following: true,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  followUser,
};

