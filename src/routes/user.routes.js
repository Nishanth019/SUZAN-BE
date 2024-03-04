const express = require('express');
const router = express.Router();
const {UserController }= require('../controllers/user.controllers.js');

// // Routes for admin signup
router.post('/admin/signup', UserController.adminSignup);
router.post('/admin/verifyOtp', UserController.verifyOtpForAdmin);

// Routes for student signup
router.post('/student/signup', UserController.studentSignup);
router.post('/student/verifyOtp', UserController.verifyOtpForStudent);

// Routes for user signin
router.post('/signin', UserController.signin);



module.exports.UserRouter = router;