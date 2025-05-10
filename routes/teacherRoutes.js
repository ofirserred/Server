// routes/teacherProfile.routes.js

const express = require("express");
const multer  = require("multer");
const {
  createTeacherProfile,
  getTeacherProfileByEmail,
  updateTeacherProfile,
  deleteTeacherProfile
} = require("../controllers/teacherProfileController");

const router = express.Router();

// multer לאחסון תמונות בזיכרון
const upload = multer({ storage: multer.memoryStorage() });

/**
 * יצירת פרופיל מורה – JSON בלבד, בלי multer
 */
router.post(
  "/teacher-profile",
  createTeacherProfile
);

/**
 * קריאה של פרופיל מורה לפי אימייל
 */
router.get(
  "/teacher-profile",
  getTeacherProfileByEmail
);

/**
 * עדכון פרופיל מורה – כולל אפשרות להעלות תמונה חדשה ב-field "image"
 */
router.put(
  "/teacher-profile",
  upload.single("image"),
  updateTeacherProfile
);

/**
 * מחיקת פרופיל מורה & משתמש
 */
router.post(
  "/teacher-delete-profile",
  deleteTeacherProfile
);

module.exports = router;
