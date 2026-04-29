const router = require("express").Router();
const User = require("../models/User");

// Save favorite college
router.post("/favorite", async (req, res) => {
  const { userId, collegeId } = req.body;

  await User.findByIdAndUpdate(userId, {
    $addToSet: { favorites: collegeId },
  });

  res.json("Added to favorites");
});

// Save comparison
router.post("/compare", async (req, res) => {
  const { userId, colleges } = req.body;

  await User.findByIdAndUpdate(userId, {
    $push: { comparisons: colleges },
  });

  res.json("Comparison saved");
});

module.exports = router;
