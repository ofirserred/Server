// controllers/teacherProfile.controller.js

const TeacherProfile = require("../models/TeacherProfile");
const User           = require("../models/User");

/**
 * Create teacher profile
 */
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
      about
    } = req.body;

    // אם כבר יש פרופיל כזה
    const existing = await TeacherProfile.findOne({ userEmail });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "פרופיל מורה כבר קיים" });
    }

    const profile = new TeacherProfile({
      userEmail,
      firstName,
      lastName,
      birthDate,
      gender,
      city,
      priceFrom,
      priceTo,
      subjects: subjects ? subjects.split(",") : [],
      experience,
      about
    });

    // אם הועלתה תמונה
    if (req.file) {
      profile.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await profile.save();

    // הכן שדה imageUrl ללקוח (data URI)
    const result = profile.toObject();
    if (result.image && result.image.data) {
      result.imageUrl = `data:${result.image.contentType};base64,` +
                        result.image.data.toString("base64");
      delete result.image;
    }

    return res
      .status(201)
      .json({ success: true, message: "פרופיל מורה נשמר בהצלחה", profile: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Read teacher profile by email query
 */
const getTeacherProfileByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const profile = await TeacherProfile.findOne({ userEmail: email }).lean();
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "פרופיל מורה לא נמצא" });
    }

    if (profile.image && profile.image.data) {
      profile.imageUrl = `data:${profile.image.contentType};base64,` +
                         profile.image.data.toString("base64");
      delete profile.image;
    }

    return res.status(200).json({ success: true, profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update teacher profile fields
 */
const updateTeacherProfile = async (req, res) => {
  try {
    const { userEmail, priceFrom, priceTo, subjects, experience, about } = req.body;
    const updateFields = { priceFrom, priceTo, experience, about };
    if (subjects) updateFields.subjects = subjects.split(",");

    // אם הועלתה תמונה חדשה
    if (req.file) {
      updateFields.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const updated = await TeacherProfile.findOneAndUpdate(
      { userEmail },
      updateFields,
      { new: true }
    ).lean();
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "פרופיל מורה לא נמצא לעדכון" });
    }

    if (updated.image && updated.image.data) {
      updated.imageUrl = `data:${updated.image.contentType};base64,` +
                         updated.image.data.toString("base64");
      delete updated.image;
    }

    return res
      .status(200)
      .json({ success: true, message: "הפרופיל עודכן בהצלחה", profile: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete teacher profile & user
 */
const deleteTeacherProfile = async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    // אימות סיסמה
    const user = await User.findOne({ email: userEmail });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "סיסמה שגויה" });
    }

    await TeacherProfile.findOneAndDelete({ userEmail });
    await User.findOneAndDelete({ email: userEmail });

    return res.json({ success: true, message: "המשתמש והפרופיל נמחקו בהצלחה" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTeacherProfile,
  getTeacherProfileByEmail,
  updateTeacherProfile,
  deleteTeacherProfile
};
