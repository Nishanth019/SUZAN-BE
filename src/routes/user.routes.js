const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');

// Routes for admin signup
router.post('/admin/signup', userController.adminSignup);
router.post('/admin/verifyOtp', userController.verifyOtpForAdmin);

// Routes for student signup
router.post('/student/signup', userController.studentSignup);
router.post('/student/verifyOtp', userController.verifyOtpForStudent);

// Routes for user signin
router.post('/signin', userController.signin);



module.exports = router;
