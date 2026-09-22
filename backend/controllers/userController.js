const User = require("../models/User");
const College = require("../models/College");

// @desc    Toggle favorite college (add or remove)
// @route   POST /api/users/favorites/toggle
// @access  Private
exports.toggleFavorite = async (req, res, next) => {
  try {
    const { collegeId } = req.body;

    if (!collegeId) {
      return res.status(400).json({
        success: false,
        message: "Please provide collegeId",
      });
    }

    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    const user = await User.findById(req.user._id);
    const existingIndex = user.favorites.findIndex(
      (id) => id.toString() === collegeId.toString()
    );

    let isFavorite = false;
    if (existingIndex > -1) {
      // Remove from favorites
      user.favorites.splice(existingIndex, 1);
      isFavorite = false;
    } else {
      // Add to favorites
      user.favorites.push(collegeId);
      isFavorite = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      isFavorite,
      message: isFavorite ? "Added to favorites" : "Removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's favorite colleges
// @route   GET /api/users/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "favorites",
      select: "name location fees ranking image averagePackage highestPackage ratingsAverage courses",
    });

    res.status(200).json({
      success: true,
      count: user.favorites.length,
      data: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save comparison set
// @route   POST /api/users/comparisons
// @access  Private
exports.saveComparison = async (req, res, next) => {
  try {
    const { collegeIds } = req.body;

    if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of at least 2 college IDs",
      });
    }

    const user = await User.findById(req.user._id);
    user.comparisons.push(collegeIds);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Comparison saved successfully",
      comparisons: user.comparisons,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's saved comparisons
// @route   GET /api/users/comparisons
// @access  Private
exports.getSavedComparisons = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "comparisons",
      populate: {
        path: "favorites",
        select: "name location fees ranking image averagePackage",
      },
    });

    res.status(200).json({
      success: true,
      data: user.comparisons,
    });
  } catch (error) {
    next(error);
  }
};
