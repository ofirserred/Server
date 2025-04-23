const StudentProfile = require("../models/StudentProfile");

const createStudentProfile = async (req, res) => {
  try {
    const { userEmail, firstName, grade, region, gender } = req.body;

    const existing = await StudentProfile.findOne({ userEmail });
    if (existing) {
      return res.status(400).json({ success: false, message: "פרופיל לתלמיד זה כבר קיים" });
    }

    const profile = new StudentProfile({
      userEmail,
	  firstName,
      grade,
      region,
      gender
    });

    await profile.save();

    res.status(201).json({ success: true, message: "פרופיל תלמיד נשמר בהצלחה", profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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


module.exports = {
  createStudentProfile,
  getStudentProfileByEmail
};
