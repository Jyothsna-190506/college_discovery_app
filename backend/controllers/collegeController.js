const College = require("../models/College");
const Review = require("../models/Review");

// @desc    Get all colleges with search, filters, sorting, and pagination
// @route   GET /api/colleges
// @access  Public
exports.getColleges = async (req, res, next) => {
  try {
    const {
      search,
      feeFilter,
      minFees,
      maxFees,
      maxRank,
      type,
      location,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Search by name, location, city, state, or course
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { "courses.name": { $regex: search, $options: "i" } },
      ];
    }

    // Fee filtering
    if (feeFilter === "low") {
      query.fees = { $lt: 200000 };
    } else if (feeFilter === "high") {
      query.fees = { $gte: 200000 };
    }

    if (minFees || maxFees) {
      query.fees = query.fees || {};
      if (minFees) query.fees.$gte = Number(minFees);
      if (maxFees) query.fees.$lte = Number(maxFees);
    }

    // Ranking filter
    if (maxRank) {
      query.ranking = { $lte: Number(maxRank) };
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // Location/State filter
    if (location) {
      query.$or = [
        { state: { $regex: location, $options: "i" } },
        { city: { $regex: location, $options: "i" } },
      ];
    }

    // Sorting
    let sortOption = { ranking: 1 }; // Default: top ranked first
    if (sort === "fees_asc") sortOption = { fees: 1 };
    if (sort === "fees_desc") sortOption = { fees: -1 };
    if (sort === "rating_desc") sortOption = { ratingsAverage: -1 };
    if (sort === "package_desc") sortOption = { averagePackage: -1 };
    if (sort === "ranking_asc") sortOption = { ranking: 1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalColleges = await College.countDocuments(query);
    const colleges = await College.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: colleges.length,
      total: totalColleges,
      totalPages: Math.ceil(totalColleges / limitNum) || 1,
      currentPage: pageNum,
      data: colleges,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single college by ID
// @route   GET /api/colleges/:id
// @access  Public
exports.getCollegeById = async (req, res, next) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    // Fetch latest reviews for this college
    const reviews = await Review.find({ college: college._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Fetch 3 related colleges (nearby ranking)
    const related = await College.find({
      _id: { $ne: college._id },
      ranking: { $gte: Math.max(1, college.ranking - 10), $lte: college.ranking + 10 },
    })
      .limit(3)
      .select("name location fees ranking image averagePackage ratingsAverage");

    res.status(200).json({
      success: true,
      data: college,
      reviews,
      related,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new college
// @route   POST /api/colleges
// @access  Private/Admin
exports.createCollege = async (req, res, next) => {
  try {
    const college = await College.create(req.body);
    res.status(201).json({
      success: true,
      message: "College created successfully",
      data: college,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update college
// @route   PUT /api/colleges/:id
// @access  Private/Admin
exports.updateCollege = async (req, res, next) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "College updated successfully",
      data: college,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete college
// @route   DELETE /api/colleges/:id
// @access  Private/Admin
exports.deleteCollege = async (req, res, next) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    // Also clean up any reviews associated with this college
    await Review.deleteMany({ college: req.params.id });

    res.status(200).json({
      success: true,
      message: "College and related reviews deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Predict colleges based on entrance exam and user rank
// @route   POST /api/colleges/predict
// @access  Public
exports.predictColleges = async (req, res, next) => {
  try {
    const {
      exam = "JEE MAIN",
      rank,
      category = "General",
      preferredBranch,
      maxFees,
    } = req.body;

    if (!rank || isNaN(rank) || Number(rank) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid numeric rank",
      });
    }

    const userRank = Number(rank);
    const normalizedExam = exam.toUpperCase().trim();

    // Query colleges
    const query = {};
    if (maxFees) {
      query.fees = { $lte: Number(maxFees) };
    }

    const allColleges = await College.find(query);

    const safe = [];
    const target = [];
    const reach = [];

    allColleges.forEach((col) => {
      // Find matching cutoffs
      let matchingCutoffs = (col.cutoffs || []).filter((c) => {
        const examMatch =
          c.exam.toUpperCase().includes(normalizedExam) ||
          normalizedExam.includes(c.exam.toUpperCase());
        const catMatch =
          !category ||
          c.category.toLowerCase() === category.toLowerCase() ||
          c.category.toLowerCase() === "general";
        const branchMatch =
          !preferredBranch ||
          c.branch.toLowerCase().includes(preferredBranch.toLowerCase());

        return examMatch && catMatch && branchMatch;
      });

      // If no exact exam cutoff found, use ranking heuristic based on exam
      let bestClosingRank = null;
      let matchedBranch = "Computer Science / General Engineering";

      if (matchingCutoffs.length > 0) {
        // Sort by closing rank closest to user rank
        matchingCutoffs.sort((a, b) => b.closingRank - a.closingRank);
        bestClosingRank = matchingCutoffs[0].closingRank;
        matchedBranch = matchingCutoffs[0].branch;
      } else {
        // Heuristic based on NIRF rank for JEE/NEET
        // E.g., Rank 1 college closes ~ 500-1500, Rank 10 closes ~ 4000-8000
        bestClosingRank = Math.round(col.ranking * 450 + 200);
      }

      const collegeInfo = {
        _id: col._id,
        name: col.name,
        location: col.location,
        ranking: col.ranking,
        fees: col.fees,
        averagePackage: col.averagePackage,
        highestPackage: col.highestPackage,
        image: col.image,
        ratingsAverage: col.ratingsAverage,
        matchedBranch,
        closingRank: bestClosingRank,
      };

      // Classification:
      // Safe: closingRank >= userRank * 1.15 (User's rank is comfortably better than cutoff)
      // Target: closingRank between userRank * 0.85 and 1.15
      // Reach: closingRank between userRank * 0.55 and 0.85
      if (bestClosingRank >= userRank * 1.15) {
        safe.push({
          ...collegeInfo,
          chance: "High Chance (Safe)",
          probability: Math.min(96, Math.round(80 + (bestClosingRank / userRank) * 8)),
        });
      } else if (bestClosingRank >= userRank * 0.85) {
        target.push({
          ...collegeInfo,
          chance: "Moderate Chance (Target)",
          probability: Math.round(55 + ((bestClosingRank - userRank * 0.85) / (userRank * 0.3)) * 25),
        });
      } else if (bestClosingRank >= userRank * 0.55) {
        reach.push({
          ...collegeInfo,
          chance: "Competitive (Reach / Dream)",
          probability: Math.round(25 + ((bestClosingRank - userRank * 0.55) / (userRank * 0.3)) * 25),
        });
      }
    });

    // Sort buckets by NIRF ranking
    safe.sort((a, b) => a.ranking - b.ranking);
    target.sort((a, b) => a.ranking - b.ranking);
    reach.sort((a, b) => a.ranking - b.ranking);

    res.status(200).json({
      success: true,
      input: { exam: normalizedExam, rank: userRank, category, preferredBranch },
      summary: {
        safeCount: safe.length,
        targetCount: target.length,
        reachCount: reach.length,
        totalSuggestions: safe.length + target.length + reach.length,
      },
      results: {
        safe,
        target,
        reach,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregate statistics for colleges
// @route   GET /api/colleges/stats/summary
// @access  Public
exports.getCollegeStats = async (req, res, next) => {
  try {
    const total = await College.countDocuments();
    const stats = await College.aggregate([
      {
        $group: {
          _id: null,
          avgFees: { $avg: "$fees" },
          minFees: { $min: "$fees" },
          maxFees: { $max: "$fees" },
          avgPlacementRate: { $avg: "$placementRate" },
          avgPackage: { $avg: "$averagePackage" },
        },
      },
    ]);

    const cities = await College.distinct("city");

    res.status(200).json({
      success: true,
      data: {
        totalColleges: total,
        metrics: stats[0] || {},
        totalCities: cities.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
