const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require('./../controller/authController');

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);

router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;