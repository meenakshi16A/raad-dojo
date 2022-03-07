const express = require('express');
const router = express.Router();

const { register, login, logout, forgetpassword,otpverify,setpassword} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forget-password', forgetpassword);
router.post('/otpverify', otpverify);
router.post('/set-password', setpassword);

module.exports = router;
