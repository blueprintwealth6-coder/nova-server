const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    // Video Owner
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Video Title
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // Description
    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    // Hashtags
    hashtags: [
      {
        type: String,
      },
    ],

    // Category
    category: {
      type: String,
      enum: [
        "AI",
        "Funny",
        "Football",
        "Cricket",
        "Gaming",
        "Music",
        "Education",
        "Sports",
        "Technology",
        "Other",
      ],
      default: "Other",
    },

    // Visibility
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    // Video URL
    videoUrl: {
      type: String,
      required: true,
    },

    // Thumbnail (future use)
    thumbnail: {
      type: String,
      default: "",
    },

    // Views
    views: {
      type: Number,
      default: 0,
    },

    // Likes
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Comments
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        text: {
          type: String,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Video", videoSchema);