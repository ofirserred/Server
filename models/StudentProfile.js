const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  firstName: { type: String, required: true }, // ✅ נוסף
  grade: String,
  region: String,
  gender: String
}, { timestamps: true });

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
