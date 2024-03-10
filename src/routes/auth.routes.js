const express = require("express");
const router = express.Router();

const { Auth } = require("../middlewares/auth.middlewares.js");
const { AuthController } = require("../controllers/auth.controllers.js");

// Routes for admin signup
router.post("/admin/signup", AuthController.adminSignup);
router.post("/admin/verifyOtp", AuthController.verifyOtpForAdmin);
router.post("/admin/completeSignup", AuthController.completeAdminSignup);

// Routes for student signup
router.post("/student/signup", AuthController.studentSignup);
router.post("/student/verifyOtp", AuthController.verifyOtpForStudent);
router.post("/student/completeSignup", AuthController.completeStudentSignup);

// Routes for user signin
router.post("/signin", AuthController.signin);

// Routes for forget password
router.post("/forgetpassword", AuthController.forgetPassword);

// Routes for change password
router.post("/changepassword", AuthController.verifyOtpAndChangePassword);


// Route for logout
router.post("/logout", AuthController.logout);


module.exports.AuthRouter = router;
