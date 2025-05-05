const express = require("express");
const router = express.Router();
const { createStudentProfile, getStudentProfileByEmail, deleteStudentProfile } = require("../controllers/studentProfileController");

router.post("/student-profile", createStudentProfile);
router.get("/student-profile", getStudentProfileByEmail); // ⬅️ נוספה שורה זו
router.post("/delete-profile",   deleteStudentProfile);  // ← הוסיפו את ה-route הזה


module.exports = router;
