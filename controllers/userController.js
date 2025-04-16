// controllers/userController.js
const User = require('../models/User');

// יצירת משתמש חדש
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({ name, email, password }); // שים לב שהוספתי גם את הסיסמה אם יש שדה כזה במודל
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



// שליפת כל המשתמשים
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createUser, getUsers };
