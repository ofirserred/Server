const mongoose = require("mongoose");

const teacherProfileSchema = new mongoose.Schema({
  userEmail: { type: String, required: true }, // מזהה את המשתמש
  birthDate: String,
  gender: String,
  city: String,
  priceFrom: Number,
  priceTo: Number,
  subjects: [String],
  experience: Number,
  about: String,
  imageUrl: String // אם תשתמש בעתיד בתמונה
}, { timestamps: true });

module.exports = mongoose.model("TeacherProfile", teacherProfileSchema);
