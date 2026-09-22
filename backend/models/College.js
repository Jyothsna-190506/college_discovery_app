const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
      index: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    ranking: {
      type: Number,
      required: [true, "NIRF/National ranking is required"],
      min: 1,
    },
    type: {
      type: String,
      enum: ["Public / National Importance", "Public State University", "Private Deemed", "Autonomous"],
      default: "Public / National Importance",
    },
    establishedYear: {
      type: Number,
    },
    campusSize: {
      type: String,
      default: "100+ Acres",
    },
    fees: {
      type: Number,
      required: [true, "Annual fees is required"],
      min: 0,
    },
    averagePackage: {
      type: Number,
      default: 10,
    },
    highestPackage: {
      type: Number,
      default: 30,
    },
    placementRate: {
      type: Number,
      default: 85,
    },
    topRecruiters: {
      type: [String],
      default: ["Google", "Microsoft", "Amazon", "Goldman Sachs"],
    },
    courses: [
      {
        name: { type: String, required: true },
        degree: { type: String, default: "B.Tech" },
        duration: { type: String, default: "4 Years" },
        annualFee: { type: Number },
        eligibility: { type: String },
      },
    ],
    cutoffs: [
      {
        exam: { type: String, required: true, uppercase: true, trim: true }, // e.g. "JEE MAIN", "JEE ADVANCED", "NEET", "BITSAT", "GATE"
        branch: { type: String, required: true },
        category: { type: String, default: "General" }, // "General", "OBC", "SC", "ST", "EWS"
        closingRank: { type: Number, required: true },
      },
    ],
    facilities: {
      type: [String],
      default: ["Hostel", "Wi-Fi Campus", "Sports Complex", "Library", "Modern Labs", "Cafeteria"],
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200",
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Slugify name before save if needed
collegeSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");
  }
});

module.exports = mongoose.model("College", collegeSchema);
