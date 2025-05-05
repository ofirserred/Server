// routes/studentRoutes.js

const express = require("express");
const router = express.Router();
const {
  createStudentProfile,
  getStudentProfileByEmail,
  updateStudentProfile,
  deleteStudentProfile
} = require("../controllers/studentProfileController");

// שליפת פרופיל לפי אימייל
router.get("/student-profile", getStudentProfileByEmail);

// יצירת פרופיל חדש
router.post("/student-profile", createStudentProfile);

// עדכון שדות בפרופיל
router.put("/student-profile", updateStudentProfile);

// מחיקת פרופיל + משתמש
router.post("/delete-profile", deleteStudentProfile);

module.exports = router;
