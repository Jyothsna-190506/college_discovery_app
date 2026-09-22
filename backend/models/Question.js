const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    authorName: {
      type: String,
      default: "Student",
    },
    text: {
      type: String,
      required: [true, "Answer text is required"],
      trim: true,
    },
    upvotes: [
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

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    details: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      default: ["General", "Admissions"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    authorName: {
      type: String,
      default: "Student",
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },
    collegeName: {
      type: String,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    answers: [answerSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);
