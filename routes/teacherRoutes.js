// routes/teacherRoutes.js

const express = require("express");
const router = express.Router();
const {
  createTeacherProfile,
  getTeacherProfileByEmail,
  deleteTeacherProfile   // ← הוסיפו כאן
} = require("../controllers/teacherProfileController");

router.get("/teacher-profile",   getTeacherProfileByEmail);
router.post("/teacher-profile",  createTeacherProfile);
router.post("/teacher-delete-profile", deleteTeacherProfile);

module.exports = router;
