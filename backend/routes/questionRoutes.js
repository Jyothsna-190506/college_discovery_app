const express = require("express");
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  addAnswer,
  toggleUpvoteQuestion,
} = require("../controllers/questionController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getQuestions).post(protect, createQuestion);
router.route("/:id").get(getQuestionById);
router.route("/answer/:id").post(protect, addAnswer);
router.route("/:id/upvote").post(protect, toggleUpvoteQuestion);

module.exports = router;
