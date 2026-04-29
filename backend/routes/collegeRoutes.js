const router = require("express").Router();
const College = require("../models/College");

// Get all colleges
router.get("/", async (req, res) => {
  const colleges = await College.find();
  res.json(colleges);
});

// Add college
router.post("/", async (req, res) => {
  const college = await College.create(req.body);
  res.json(college);
});
// Get single college by ID
router.get("/:id", async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    res.json(college);
  } catch (err) {
    res.status(500).json("Error fetching college");
  }
});
module.exports = router;
