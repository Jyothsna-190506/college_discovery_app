const Review = require("../models/Review");
const College = require("../models/College");

// @desc    Get reviews for a college
// @route   GET /api/reviews/:collegeId
// @access  Public
exports.getCollegeReviews = async (req, res, next) => {
  try {
    const { collegeId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Review.countDocuments({ college: collegeId });
    const reviews = await Review.find({ college: collegeId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update review for a college
// @route   POST /api/reviews
// @access  Private (Registered User)
exports.createReview = async (req, res, next) => {
  try {
    const { collegeId, rating, comment, title, pros, cons } = req.body;

    if (!collegeId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide collegeId, rating, and comment",
      });
    }

    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    // Check if user already reviewed this college
    let review = await Review.findOne({
      college: collegeId,
      user: req.user._id,
    });

    if (review) {
      // Update existing review
      review.rating = Number(rating);
      review.comment = comment;
      review.title = title || review.title;
      review.pros = pros || review.pros;
      review.cons = cons || review.cons;
      review.userName = req.user.name;
      review.userAvatar = req.user.avatar;
      await review.save();

      return res.status(200).json({
        success: true,
        message: "Your review has been updated",
        data: review,
      });
    }

    // Create new review
    review = await Review.create({
      college: collegeId,
      user: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      rating: Number(rating),
      title: title || "",
      comment,
      pros: pros || "",
      cons: cons || "",
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner or Admin)
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check ownership or admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
