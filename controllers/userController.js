// controllers/userController.js
const User = require('../models/User');

// יצירת משתמש חדש
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const newUser = new User({ name, email });
    await newUser.save();

    res.status(201).json({ message: 'User created', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
