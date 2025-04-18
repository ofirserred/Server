const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const TeacherProfile = require('../models/TeacherProfile');

// יצירת משתמש חדש
const createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "משתמש עם מייל זה כבר קיים" });
    }

    const newUser = new User({ email, password, role });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'המשתמש נוצר בהצלחה',
      user: newUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// התחברות
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "משתמש לא נמצא" });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "סיסמה שגויה" });
    }

    let hasProfile = false;

    if (user.role === 'teacher') {
      const profile = await TeacherProfile.findOne({ userEmail: email });
      hasProfile = !!profile;
    } else if (user.role === 'student') {
      const profile = await StudentProfile.findOne({ userEmail: email });
      hasProfile = !!profile;
    }

    return res.status(200).json({
      success: true,
      message: "התחברת בהצלחה",
      user: {
        email: user.email,
        role: user.role,
        hasProfile
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// שליפת כל המשתמשים
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createUser, getUsers, loginUser };
