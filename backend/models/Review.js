const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: [true, "Review must belong to a college"],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    userName: {
      type: String,
      required: true,
      default: "Student",
    },
    userAvatar: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      required: [true, "Rating between 1 and 5 is required"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
    },
    pros: {
      type: String,
      default: "",
    },
    cons: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting multiple reviews for same college
reviewSchema.index({ college: 1, user: 1 }, { unique: true });

// Static method to calculate average rating for a college
reviewSchema.statics.calcAverageRatings = async function (collegeId) {
  const stats = await this.aggregate([
    {
      $match: { college: collegeId },
    },
    {
      $group: {
        _id: "$college",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  const College = mongoose.model("College");

  if (stats.length > 0) {
    await College.findByIdAndUpdate(collegeId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: Math.round(stats[0].avgRating * 10) / 10,
    });
  } else {
    await College.findByIdAndUpdate(collegeId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// Call calcAverageRatings after save
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.college);
});

// Call calcAverageRatings after remove/delete
reviewSchema.post("findOneAndDelete", function (doc) {
  if (doc) {
    doc.constructor.calcAverageRatings(doc.college);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
