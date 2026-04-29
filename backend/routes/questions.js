const router = require("express").Router();
const Question = require("../models/Question");

// Add question
router.post("/", async (req, res) => {
  const q = await Question.create({ question: req.body.question });
  res.json(q);
});

// Get all questions
router.get("/", async (req, res) => {
  const data = await Question.find();
  res.json(data);
});

// Add answer
router.post("/answer/:id", async (req, res) => {
  const updated = await Question.findByIdAndUpdate(
    req.params.id,
    { $push: { answers: req.body.answer } },
    { new: true },
  );
  res.json(updated);
});

module.exports = router;
