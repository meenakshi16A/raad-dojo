const express = require('express');
const router = express.Router();

const { register, login, logout, forgetpassword} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forget-password', forgetpassword);

module.exports = router;
