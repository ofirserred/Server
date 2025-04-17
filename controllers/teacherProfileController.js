const TeacherProfile = require("../models/TeacherProfile");

const createTeacherProfile = async (req, res) => {
  try {
    const {
      userEmail,
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

module.exports = { createTeacherProfile };
