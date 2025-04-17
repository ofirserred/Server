const express = require("express");
const router = express.Router();
const { createTeacherProfile } = require("../controllers/teacherProfileController");

router.post("/teacher-profile", createTeacherProfile);

module.exports = router;
