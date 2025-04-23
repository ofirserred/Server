const express = require("express");
const router = express.Router();
const { createStudentProfile, getStudentProfileByEmail } = require("../controllers/studentProfileController");

router.post("/student-profile", createStudentProfile);
router.get("/student-profile", getStudentProfileByEmail); // ⬅️ נוספה שורה זו

module.exports = router;
