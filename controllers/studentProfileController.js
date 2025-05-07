const StudentProfile = require("../models/StudentProfile");

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
    const { email, password } = req.body;
    // אם תרצו אימות סיסמה, תשלפו קודם user, תבדקו שה־password נכון, ואז:
    const deleted = await StudentProfile.findOneAndDelete({ userEmail: email });
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "פרופיל לא נמצא למחיקה" });
    }
    return res.status(200).json({ success: true, message: "הפרופיל נמחק" });
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
