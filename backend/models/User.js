const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }],
  comparisons: [[{ type: mongoose.Schema.Types.ObjectId, ref: "College" }]],
});

module.exports = mongoose.model("User", userSchema);
