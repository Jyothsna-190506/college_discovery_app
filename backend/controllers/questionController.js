const Question = require("../models/Question");
const College = require("../models/College");

// @desc    Get all questions with filter and search
// @route   GET /api/questions
// @access  Public
exports.getQuestions = async (req, res, next) => {
  try {
    const { search, tag, collegeId } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { question: { $regex: search, $options: "i" } },
        { details: { $regex: search, $options: "i" } },
      ];
    }

    if (tag && tag !== "All") {
      query.tags = { $in: [tag] };
    }

    if (collegeId) {
      query.college = collegeId;
    }

    const questions = await Question.find(query)
      .populate("author", "name avatar")
      .populate("college", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single question by ID
// @route   GET /api/questions/:id
// @access  Public
exports.getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("author", "name avatar")
      .populate("college", "name")
      .populate("answers.author", "name avatar");

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new question
// @route   POST /api/questions
// @access  Private
exports.createQuestion = async (req, res, next) => {
  try {
    const { question, details, tags, collegeId } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Please provide a question title",
      });
    }

    let collegeName = "";
    if (collegeId) {
      const col = await College.findById(collegeId);
      if (col) collegeName = col.name;
    }

    const newQuestion = await Question.create({
      question,
      details: details || "",
      tags: tags && tags.length > 0 ? tags : ["Admissions"],
      author: req.user ? req.user._id : null,
      authorName: req.user ? req.user.name : "Anonymous Student",
      college: collegeId || null,
      collegeName,
    });

    res.status(201).json({
      success: true,
      message: "Question posted successfully",
      data: newQuestion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add answer to question
// @route   POST /api/questions/answer/:id
// @access  Private
exports.addAnswer = async (req, res, next) => {
  try {
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({
        success: false,
        message: "Please provide answer text",
      });
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const newAnswer = {
      author: req.user ? req.user._id : null,
      authorName: req.user ? req.user.name : "Student",
      text: answer,
      upvotes: [],
      createdAt: new Date(),
    };

    question.answers.push(newAnswer);
    await question.save();

    res.status(200).json({
      success: true,
      message: "Answer added successfully",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle upvote for a question
// @route   POST /api/questions/:id/upvote
// @access  Private
exports.toggleUpvoteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const userId = req.user._id.toString();
    const upvoteIndex = question.upvotes.findIndex(
      (id) => id.toString() === userId
    );

    if (upvoteIndex > -1) {
      // Remove upvote
      question.upvotes.splice(upvoteIndex, 1);
    } else {
      // Add upvote
      question.upvotes.push(req.user._id);
    }

    await question.save();

    res.status(200).json({
      success: true,
      upvotesCount: question.upvotes.length,
      hasUpvoted: upvoteIndex === -1,
    });
  } catch (error) {
    next(error);
  }
};
