const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
  },
  user: String,
  rating: Number,
  comment: String,
});

module.exports = mongoose.model("Review", reviewSchema);
