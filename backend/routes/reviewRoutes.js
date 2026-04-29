const router = require("express").Router();
const Review = require("../models/Review");

// Add review
router.post("/", async (req, res) => {
  console.log(req.body);
  const review = await Review.create(req.body);
  res.json(review);
});

// Get reviews for a college
router.get("/:collegeId", async (req, res) => {
  const reviews = await Review.find({ collegeId: req.params.collegeId });
  res.json(reviews);
});

module.exports = router;
