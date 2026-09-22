const express = require("express");
const router = express.Router();
const {
  getCollegeReviews,
  createReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, createReview);
router.route("/:collegeId").get(getCollegeReviews);
router.route("/:id").delete(protect, deleteReview);

module.exports = router;
