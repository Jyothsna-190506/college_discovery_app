const router = require("express").Router();
const User = require("../models/User");

// Add to favorites
router.post("/favorite", async (req, res) => {
  const { userId, collegeId } = req.body;

  const user = await User.findById(userId);
  user.favorites.push(collegeId);
  await user.save();

  res.json(user);
});
module.exports = router;
