const router = require("express").Router();
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// Login
router.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (!user) return res.status(400).json("Invalid credentials");

  res.json(user);
});

module.exports = router;
