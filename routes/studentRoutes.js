const express = require("express");
const router = express.Router();
const { createStudentProfile } = require("../controllers/studentProfileController");

router.post("/student-profile", createStudentProfile);

module.exports = router;
