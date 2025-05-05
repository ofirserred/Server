// controllers/teacherProfileController.js

const TeacherProfile = require("../models/TeacherProfile");
const User = require("../models/User");

// ... createTeacherProfile, getTeacherProfileByEmail כבר קיימים כאן

/**
 * DELETE teacher profile & user after password confirmation
 */
const deleteTeacherProfile = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) מציאת המשתמש ובדיקת סיסמה
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "סיסמה שגויה" });
    }

    // 2) מחיקת פרופיל המורה
    await TeacherProfile.deleteOne({ userEmail: email });

    // 3) מחיקת המשתמש עצמו
    await User.deleteOne({ email });

    return res.json({ success: true, message: "הפרופיל נמחק בהצלחה" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTeacherProfile,
  getTeacherProfileByEmail,
  deleteTeacherProfile    // ← הוסיפו אותו כאן
};
