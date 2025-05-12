// controllers/teacherProfileController.js

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

    // parse subjects again
    let subjectsArray = [];
    if (subjects) {
      if (Array.isArray(subjects)) {
        subjectsArray = subjects;
      } else {
        try {
          subjectsArray = JSON.parse(subjects);
        } catch {
          subjectsArray = subjects.split(",").map(s => s.trim());
        }
      }
    }

    const updateFields = { priceFrom, priceTo, experience, about };
    if (subjectsArray.length) updateFields.subjects = subjectsArray;

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


const searchTeachers = async (req, res) => {
  try {
    const { name = "", subjects = "" } = req.query;
    const nameRegex = new RegExp(name.trim(), "i");

    const subjectList = subjects
      .split(" ")
      .map(s => s.trim())
      .filter(Boolean);

    const query = {};

    // סינון לפי שם (פרטי / משפחה / מלא)
    if (name.trim()) {
      query.$or = [
        { firstName: nameRegex },
        { lastName: nameRegex },
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ["$firstName", " ", "$lastName"] },
              regex: nameRegex
            }
          }
        }
      ];
    }

    // סינון לפי מקצועות
    if (subjectList.length > 0) {
      query.subjects = { $in: subjectList };
    }

    const teachers = await TeacherProfile.find(query).lean();

    // הסרת שדה תמונה כדי לא להעביר נתונים כבדים
    teachers.forEach(t => delete t.image);

    return res.json(teachers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "שגיאה בחיפוש מורים" });
  }
};


module.exports = {
  createTeacherProfile,
  getTeacherProfileByEmail,
  updateTeacherProfile,
  deleteTeacherProfile,
  searchTeachers

};
