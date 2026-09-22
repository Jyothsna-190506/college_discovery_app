const express = require("express");
const router = express.Router();
const {
  toggleFavorite,
  getFavorites,
  saveComparison,
  getSavedComparisons,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/favorites/toggle", protect, toggleFavorite);
router.get("/favorites", protect, getFavorites);
router.post("/comparisons", protect, saveComparison);
router.get("/comparisons", protect, getSavedComparisons);

module.exports = router;
