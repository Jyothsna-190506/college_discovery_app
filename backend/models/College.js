const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  name: String,
  location: String,
  ranking: Number,
  courses: [String],
  fees: Number,
  image: String,
});

module.exports = mongoose.model("College", collegeSchema);
