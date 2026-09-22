const express = require("express");
const router = express.Router();
const {
  getColleges,
  getCollegeById,
  createCollege,
  updateCollege,
  deleteCollege,
  predictColleges,
  getCollegeStats,
} = require("../controllers/collegeController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Stats & Predictor endpoints (placed before /:id)
router.get("/stats/summary", getCollegeStats);
router.post("/predict", predictColleges);

// Main CRUD endpoints
router
  .route("/")
  .get(getColleges)
  .post(protect, authorize("admin"), createCollege);

router
  .route("/:id")
  .get(getCollegeById)
  .put(protect, authorize("admin"), updateCollege)
  .delete(protect, authorize("admin"), deleteCollege);

module.exports = router;
