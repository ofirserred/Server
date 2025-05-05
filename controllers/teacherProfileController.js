// controllers/teacherProfileController.js

const TeacherProfile = require("../models/TeacherProfile");
const User = require("../models/User");

const createTeacherProfile = async (req, res) => {
  try {
    const {
      userEmail,
      firstName,
      lastName,
      birthDate,
      gender,
      city,
      priceFrom,
      priceTo,
      subjects,
      experience,
      about,
      imageUrl
    } = req.body;

    const profile = new TeacherProfile({
      userEmail,
      firstName,
      lastName,
      birthDate,
      gender,
      city,
      priceFrom,
      priceTo,
      subjects,
      experience,
      about,
      imageUrl
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: "פרופיל מורה נשמר בהצלחה",
      profile
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTeacherProfileByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const profile = await TeacherProfile.findOne({ userEmail: email });

    if (!profile) {
      return res.status(404).json({ success: false, message: "פרופיל לא נמצא" });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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
  deleteTeacherProfile
};
