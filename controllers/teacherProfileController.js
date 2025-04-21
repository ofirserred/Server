const TeacherProfile = require("../models/TeacherProfile");

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
      imageUrl // בעתיד
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

const TeacherProfile = require("../models/TeacherProfile");

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

module.exports = {
  createTeacherProfile,
  getTeacherProfileByEmail
};
