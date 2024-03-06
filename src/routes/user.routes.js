const express = require('express');
const router = express.Router();
const {UserController }= require('../controllers/user.controllers.js');

// Routes for admin signup
router.post('/admin/signup', UserController.adminSignup);
router.post('/admin/verifyOtp', UserController.verifyOtpForAdmin);
router.post('/admin/completeSignup', UserController.completeAdminSignup);

// Routes for student signup
router.post('/student/signup', UserController.studentSignup);
router.post('/student/verifyOtp', UserController.verifyOtpForStudent);
router.post('/student/completeSignup', UserController.completeStudentSignup);

// Routes for user signin
router.post('/signin', UserController.signin);

// Routes for forget password
router.post('/forgetpassword', UserController.forgetPassword);

// Routes for change password
router.post('/changepassword', UserController.verifyOtpAndChangePassword);

module.exports.UserRouter = router;