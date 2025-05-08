const express = require("express");
const router = express.Router();
const {
  createStudentProfile,
  getStudentProfileByEmail,
  updateStudentProfile,
  deleteStudentProfile
} = require("../controllers/studentProfileController");

// יצירה
router.post("/student-profile", createStudentProfile);

// קריאה
router.get("/student-profile", getStudentProfileByEmail);

// עדכון
router.put("/student-profile", updateStudentProfile);

// מחיקה (אם כבר יש לך קובץ delete_profile_dialog, בתוכו תקרא לכתובת הזו)
router.post("/student-delete-profile", deleteStudentProfile);

module.exports = router;
