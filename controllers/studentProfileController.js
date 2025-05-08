// controllers/studentProfile.controller.js

const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");  // ייבוא מודל המשתמש

const createStudentProfile = async (req, res) => {
  try {
    const { userEmail, firstName, grade, region, gender } = req.body;
    const existing = await StudentProfile.findOne({ userEmail });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "פרופיל לתלמיד זה כבר קיים" });
    }
    const profile = new StudentProfile({
      userEmail,
      firstName,
      grade,
      region,
      gender
    });
    await profile.save();
    return res
      .status(201)
      .json({ success: true, message: "פרופיל תלמיד נשמר בהצלחה", profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getStudentProfileByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const profile = await StudentProfile.findOne({ userEmail: email });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "פרופיל לא נמצא" });
    }
    return res.status(200).json({ success: true, profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const { userEmail, grade, region } = req.body;
    const updated = await StudentProfile.findOneAndUpdate(
      { userEmail },
      { grade, region },
      { new: true }
    );
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "פרופיל לא נמצא לעדכון" });
    }
    return res.status(200).json({ success: true, profile: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteStudentProfile = async (req, res) => {
  try {
    const { userEmail , password } = req.body;  // שים לב: עכשיו שולחים userEmail

    // 1. מחיקת פרופיל הסטודנט
    const deletedProfile = await StudentProfile.findOneAndDelete({ userEmail });
    if (!deletedProfile) {
      return res
        .status(404)
        .json({ success: false, message: "פרופיל לא נמצא למחיקה" });
    }

    // 2. מחיקת ה־User עצמו
    const deletedUser = await User.findOneAndDelete({ email: userEmail });
    if (!deletedUser) {
      console.warn(`User with email ${userEmail} not found in users collection`);
      // אפשר להמשיך מכיוון שהפרופיל נמחק
    }

    return res.status(200).json({
      success: true,
      message: "המשתמש והפרופיל נמחקו בהצלחה"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createStudentProfile,
  getStudentProfileByEmail,
  updateStudentProfile,
  deleteStudentProfile
};
