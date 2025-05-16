// controllers/lessonRequestController.js

const LessonRequest = require("../models/LessonRequest");
const StudentProfile = require("../models/StudentProfile"); // ודא שזה הנתיב הנכון

const createLessonRequest = async (req, res) => {
  try {
    const { studentEmail, teacherEmail } = req.body;

    if (!studentEmail || !teacherEmail) {
      return res.status(400).json({ success: false, message: "חסר מייל תלמיד או מורה" });
    }

    // בדיקה האם לתלמיד יש פרופיל
    const studentProfile = await StudentProfile.findOne({ userEmail: studentEmail });
    if (!studentProfile) {
      return res.status(400).json({ success: false, message: "אין לתלמיד פרופיל אישי. יש להשלים פרופיל תחילה." });
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
// שליפת כל הבקשות עבור מורה מסוים + מידע על התלמיד

const getRequestsForTeacher = async (req, res) => {
  try {
    const { teacherEmail } = req.query;

    if (!teacherEmail) {
      return res.status(400).json({ success: false, message: "חסר אימייל מורה בשאילתה" });
    }

    const requests = await LessonRequest.find({ teacherEmail }).sort({ requestedAt: -1 });

    // חיבור כל בקשה עם פרופיל התלמיד
    const enrichedRequests = await Promise.all(requests.map(async (req) => {
      const studentProfile = await StudentProfile.findOne({ userEmail: req.studentEmail });

      return {
        _id: req._id,
        requestedAt: req.requestedAt,
        studentEmail: req.studentEmail,
        firstName: studentProfile?.firstName || "",
        gender: studentProfile?.gender || "",
        grade: studentProfile?.grade || "",
        region: studentProfile?.region || "",
        approved: req.approved || false,
        message: req.message || "",
        phone: req.phone || ""
      };
    }));

    res.json({ success: true, requests: enrichedRequests });

  } catch (error) {
    console.error(error);
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

// דחיית בקשה (מחיקה)
const rejectLessonRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ success: false, message: "חסר requestId" });
    }

    await LessonRequest.findByIdAndDelete(requestId);

    res.json({ success: true, message: "הבקשה נמחקה בהצלחה" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "שגיאה בדחיית הבקשה" });
  }
};

module.exports = {
  createLessonRequest,
  getRequestsForTeacher,
  approveLessonRequest,
  rejectLessonRequest 
};
