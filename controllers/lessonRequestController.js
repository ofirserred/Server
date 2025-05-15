// controllers/lessonRequestController.js

const LessonRequest = require("../models/LessonRequest");

// יצירת בקשת שיעור על ידי תלמיד
const createLessonRequest = async (req, res) => {
  try {
    const { studentEmail, teacherEmail } = req.body;

    if (!studentEmail || !teacherEmail) {
      return res.status(400).json({ success: false, message: "חסר מייל תלמיד או מורה" });
    }

    const request = new LessonRequest({ studentEmail, teacherEmail });
    await request.save();

    res.status(201).json({ success: true, message: "בקשת שיעור נשלחה בהצלחה" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "שגיאה ביצירת בקשה" });
  }
};

// שליפת כל הבקשות עבור מורה מסוים
const getRequestsForTeacher = async (req, res) => {
  try {
    const { teacherEmail } = req.query;

    if (!teacherEmail) {
      return res.status(400).json({ success: false, message: "חסר אימייל מורה בשאילתה" });
    }

    const requests = await LessonRequest.find({ teacherEmail }).sort({ requestedAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "שגיאה בשליפת בקשות" });
  }
};

// אישור בקשה + שליחת מספר טלפון והודעה
const approveLessonRequest = async (req, res) => {
  try {
    const { requestId, message, phone, scheduledDate } = req.body;

    const request = await LessonRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "בקשה לא נמצאה" });
    }

    request.approved = true;
    request.message = message || "";
    request.phone = phone || "";
    request.scheduledDate = scheduledDate || null;

    await request.save();
    res.json({ success: true, message: "הבקשה אושרה ונשמרה" });
  } catch (error) {
    res.status(500).json({ success: false, message: "שגיאה בעדכון הבקשה" });
  }
};

module.exports = {
  createLessonRequest,
  getRequestsForTeacher,
  approveLessonRequest
};
