const express = require('express');
const router = express.Router();

const {
  createUser,
  getUsers,
  loginUser
} = require('../controllers/userController');

// יצירת משתמש חדש
router.post('/users', createUser);

// התחברות
router.post('/login', loginUser);

// שליפת כל המשתמשים (לא חובה לפרודקשן, רק לצורכי בדיקה)
router.get('/users', getUsers);

module.exports = router;
