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

// הגדרת multer לאחסון בזיכרון
const upload = multer({ storage: multer.memoryStorage() });

// יצירה (כולל העלאת תמונה ב-field "image")
router.post(
  "/teacher-profile",
  upload.single("image"),
  createTeacherProfile
);

// קריאה
router.get("/teacher-profile", getTeacherProfileByEmail);

// עדכון (אפשר גם לעדכן תמונה חדשה ב-field "image")
router.put(
  "/teacher-profile",
  upload.single("image"),
  updateTeacherProfile
);

// מחיקה
router.post("/teacher-delete-profile", deleteTeacherProfile);

module.exports = router;
