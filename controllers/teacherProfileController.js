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
      experience,
      about
    } = req.body;

    // parse subjects field (could be array, JSON string, or comma-separated)
    let subjectsArray = [];
    if (req.body.subjects) {
      if (Array.isArray(req.body.subjects)) {
        subjectsArray = req.body.subjects;
      } else {
        try {
          subjectsArray = JSON.parse(req.body.subjects);
        } catch {
          subjectsArray = req.body.subjects.split(",").map(s => s.trim());
        }
      }
    }

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
      subjects: subjectsArray,
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

// ... (other controllers unchanged)

module.exports = {
  createTeacherProfile,
  getTeacherProfileByEmail,
  updateTeacherProfile,
  deleteTeacherProfile
};
