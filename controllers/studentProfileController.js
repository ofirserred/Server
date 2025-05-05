// controllers/studentProfileController.js

const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");

/**
 * CREATE profile
 */
const createStudentProfile = async (req, res) => {
  try {
    const { userEmail, firstName, grade, region, gender } = req.body;
    const existing = await StudentProfile.findOne({ userEmail });
    if (existing) {
      return res.status(400).json({ success: false, message: "פרופיל לתלמיד זה כבר קיים" });
    }
    const profile = new StudentProfile({ userEmail, firstName, grade, region, gender });
    await profile.save();
    res.status(201).json({ success: true, message: "פרופיל תלמיד נשמר בהצלחה", profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * READ profile by email
 */
const getStudentProfileByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const profile = await StudentProfile.findOne({ userEmail: email });
    if (!profile) {
      return res.status(404).json({ success: false, message: "פרופיל לא נמצא" });
    }
    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE profile fields (grade, region)
 */
const updateStudentProfile = async (req, res) => {
  try {
    const { userEmail, grade, region } = req.body;
    const updated = await StudentProfile.findOneAndUpdate(
      { userEmail },
      { grade, region },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "פרופיל לא נמצא" });
    }
    res.json({ success: true, message: "הפרופיל עודכן בהצלחה", profile: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE profile & user after password confirmation
 */
const deleteStudentProfile = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "סיסמה שגויה" });
    }
    await StudentProfile.deleteOne({ userEmail: email });
    await User.deleteOne({ email });
    return res.json({ success: true, message: "הפרופיל נמחק בהצלחה" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createStudentProfile,
  getStudentProfileByEmail,
  updateStudentProfile,
  deleteStudentProfile
};
