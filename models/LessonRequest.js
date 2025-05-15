// models/LessonRequest.js

const mongoose = require("mongoose");

const LessonRequestSchema = new mongoose.Schema({
  studentEmail: {
    type: String,
    required: true,
  },
  teacherEmail: {
    type: String,
    required: true,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  scheduledDate: {
    type: Date,
    default: null,
  }
});

module.exports = mongoose.model("LessonRequest", LessonRequestSchema);
