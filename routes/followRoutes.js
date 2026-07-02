
const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const { followUser } = require("../controllers/followController");

router.put("/:id", protect, followUser);

module.exports = router;

