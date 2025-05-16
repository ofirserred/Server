// routes/lessonRoutes.js

const express = require("express");
const router = express.Router();

const {
  createLessonRequest,
  getRequestsForTeacher,
  approveLessonRequest,
  rejectLessonRequest 
} = require("../controllers/lessonRequestController");

// יצירת בקשת שיעור חדשה
router.post("/lessons/request", createLessonRequest);

// שליפת בקשות שהתקבלו אצל מורה
router.get("/lessons/requests", getRequestsForTeacher);

// מורה מאשר או דוחה בקשת שיעור
router.post("/lessons/respond", approveLessonRequest);

router.post("/lessons/reject", rejectLessonRequest);


module.exports = router;
