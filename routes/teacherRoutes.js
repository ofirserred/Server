const express = require("express");
const router = express.Router();
const { createTeacherProfile, getTeacherProfileByEmail } = require("../controllers/teacherProfileController");

router.get("/teacher-profile", getTeacherProfileByEmail);
router.post("/teacher-profile", createTeacherProfile);

module.exports = router;
