const mongoose = require("mongoose");

const teacherProfileSchema = new mongoose.Schema({
  userEmail:  { type: String, required: true },
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  birthDate:  String,
  gender:     String,
  city:       String,
  priceFrom:  Number,
  priceTo:    Number,
  subjects:  [String],
  experience: Number,
  about:      String,

  // חדש: שדה בינארי לתמונה + contentType
  image: {
    data: Buffer,
    contentType: String
  }
}, { timestamps: true });

module.exports = mongoose.model("TeacherProfile", teacherProfileSchema,"teacherprofiles");
