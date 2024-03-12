const { User } = require("../models/User.model.js");
const { College } = require("../models/College.model.js");
const { sendMail } = require("../helpers/Email.Sender.helper.js");
const { sendToken } = require("../helpers/sendToken.helper.js");
const Hasher = require("../helpers/Hasher.helper.js");
class AuthController {
  // Admin Signup
  adminSignup = async (req, res) => {
    try {
      const { email, password, name, role } = req.body;

      const existingUser = await User.findOne({ email });

      if (
        existingUser &&
        existingUser.isEmailVerified &&
        existingUser.isUserVerified
      ) {
        if (existingUser.role !== "admin") {
          return res.status(400).json({
            success: false,
            message: "This email is registered as a student",
          });
        }
        if (existingUser.isAdminVerified) {
          return res
            .status(400)
            .json({ success: false, message: "Account already exists" });
        } else {
          return res.status(400).json({
            success: false,
            message:
              "Your account has not yet been verified by our team. Once verified, we will reach out to you shortly.",
          });
        }
      }

      if (
        existingUser &&
        existingUser.isEmailVerified &&
        !existingUser.isUserVerified
      ) {
        return res.status(201).json({
          success: true,
          message: "OTP is already Verified",
          id: existingUser._id,
        });
      }

      let otp = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit OTP

      const hashedPassword = Hasher.hash(password, 10);

      if (!existingUser) {
        const newUser = new User({
          email,
          password: hashedPassword,
          name,
          role,
          otp,
        });
        await newUser.save();
      } else {
        existingUser.name = name;
        existingUser.password = hashedPassword;
        existingUser.otp = otp;
        existingUser.role = role;
        await existingUser.save();
      }

      await sendMail(email, "Suzan verification otp", `Your otp is ${otp}`);

      res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  // Verify OTP for Admin Signup
  verifyOtpForAdmin = async (req, res) => {
    try {
      const { email, otp } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      if (user.otp === otp) {
        user.otp = -1;
        user.isEmailVerified = true;
        await user.save();
        res.status(200).json({
          success: true,
          message: "OTP verified successfully",
          id: user._id,
        });
      } else {
        res.status(400).json({ success: false, message: "Incorrect OTP" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  completeAdminSignup = async (req, res) => {
    try {
      const {
        email,
        name,
        phone,
        gender,
        college_name,
        street_name,
        city,
        state,
        pincode,
        country,
        roll_no,
        program,
        branch,
        batch,
        email_domain,
      } = req.body;

      const user = await User.findOne({ email });

      console.log(college_name);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Check if the college exists or create a new one
      let college = await College.findOne({ college_name });

      if (college) {
        return res
          .status(404)
          .json({ success: false, message: "College already exists" });
      }
      if (!college) {
        college = new College({
          college_name: college_name,
          street_name: street_name,
          city: city,
          state: state,
          pincode: pincode,
          country: country,
          email_domain: email_domain,
        });
        await college.save();
      }

      user.name = name;
      user.phone = phone;
      user.gender = gender;
      user.college = college._id; // Associate the user with the college
      user.roll_no = roll_no;
      user.program = program;
      user.branch = branch;
      user.batch = batch;
      user.email_domain = email_domain;
      user.isUserVerified = true;
      // user.isAdminVerified = true;
      await user.save();

      // Generate JWT token
      const token = await sendToken(user);
      console.log(token);
      res
        .status(200)
        .cookie("token", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          secure: true, // set to true if your using https`
          httpOnly: true,
          sameSite: "none",
        })
        .json({ success: true, message: "Details updated successfully", user });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  //student signup
  studentSignup = async (req, res) => {
    try {
      const { college_name, email, password, name, role } = req.body;

      // Check if the college exists or create a new one
      let college = await College.findOne({ college_name: college_name });

    if (!college) {
        return res.status(400).json({ success: false, message: "College not found" });
    }

    // Extract domain from college record
    let email_domain = college.email_domain;

    // Check if the entered email matches the college domain
    if (email.split('@')[1] !== email_domain) {
        return res.status(400).json({ success: false, message: "Please enter your college email" });
    }

      // Check if email already exists
      const existingUser = await User.findOne({ email });

      if (
        existingUser &&
        existingUser.isEmailVerified &&
        existingUser.isUserVerified
      ) {
        if (existingUser.role !== "student") {
          return res.status(400).json({
            success: false,
            message: "This email is registered as an admin",
          });
        }
        return res
          .status(400)
          .json({ success: false, message: "Account already exists" });
      }

      let otp = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit OTP

      const hashedPassword = Hasher.hash(password, 10);

      if (!existingUser) {
        const newUser = new User({
          college: college._id, // Associate the user with the college
          email,
          password: hashedPassword,
          name,
          otp,
          role,
        });
        await newUser.save();
      } else {
        (existingUser.college = college._id), // Associate the user with the college
          (existingUser.name = name);
        existingUser.password = hashedPassword;
        existingUser.otp = otp;
        existingUser.role = role;
        await existingUser.save();
      }

      await sendMail(email, "Suzan verification otp", `Your otp is ${otp}`);

      res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  // Verify OTP for Student Signup
  verifyOtpForStudent = async (req, res) => {
    try {
      const { email, otp } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      if (user.otp === otp) {
        user.otp = -1;
        user.isEmailVerified = true;
        await user.save();
        res.status(200).json({
          success: true,
          message: "OTP verified successfully",
          id: user._id,
        });
      } else {
        res.status(400).json({ success: false, message: "Incorrect OTP" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  completeStudentSignup = async (req, res) => {
    try {
      const { email, name, phone, gender, roll_no, program, branch, batch } =
        req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      user.name = name;
      user.phone = phone;
      user.gender = gender;
      user.roll_no = roll_no;
      user.program = program;
      user.branch = branch;
      user.batch = batch;
      user.isUserVerified = true;
      await user.save();

      // Generate JWT token
      const token = await sendToken(user);

      res
        .status(200)
        .cookie("token", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          secure: true, // set to true if your using https`
          httpOnly: true,
          sameSite: "none",
        })
        .json({ success: true, message: "Details updated successfully", user });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  // Signin Logic
  signin = async (req, res) => {
    try {
      console.log(2, req.body);
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Check if user's email is verified
      if (!user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message:
            "Email not verified, Please complete the registration process",
        });
      }

      // Check if user's account is fully verified (for both admin and student)
      if (!user.isUserVerified) {
        return res.status(400).json({
          success: false,
          message:
            "Account not completely verified. Please complete the registration process",
        });
      }

      // Check if the user is an admin
      if (user.role === "admin") {
        // Check if admin account is verified
        if (!user.isAdminVerified) {
          return res.status(400).json({
            success: false,
            message:
              "Your account has not yet been verified by our team. Once verified, we will reach out to you shortly.",
          });
        }
      }

      // Compare passwords
      const isPasswordMatch = await Hasher.compare(password, user.password);

      if (!isPasswordMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect password" });
      }

      // Password matches, generate token
      const token = await sendToken(user);

      res
        .status(200)
        .cookie("token", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          secure: true, // set to true if your using https
          httpOnly: true,
          sameSite: "none",
        })
        .json({ success: true, message: "Login successful", user });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  // Resend OTP
  resendOtp = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
  
      // Generate new OTP
      let otp = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit OTP
  
      // Save OTP to the user's record
      user.otp = otp;
      await user.save();
  
      // Send OTP to the user's email
      await sendMail(
        email,
        "Suzan Verification OTP",
        `Your resent verification OTP is ${otp}`
      );
  
      res.status(200).json({
        success: true,
        message: "Verification OTP resent successfully",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
  

  // Forget Password
  forgetPassword = async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      let otp = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit OTP

      // Save OTP to the user's record
      user.otp = otp;
      await user.save();

      // Send OTP to the user's email
      await sendMail(
        email,
        "Password Reset OTP",
        `Your password reset OTP is ${otp}`
      );

      res.status(200).json({
        success: true,
        message: "Password reset OTP sent successfully",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  // Verify OTP and Change Password Logic
  verifyOtpAndChangePassword = async (req, res) => {
    try {
      const { email, otp, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Check if OTP matches
      if (user.otp !== otp) {
        return res
          .status(400)
          .json({ success: false, message: "Incorrect OTP" });
      }

      // Update password
      const hashedPassword = Hasher.hash(password, 10);
      user.password = hashedPassword;
      user.otp = -1; // Reset OTP after password change
      await user.save();

      res
        .status(200)
        .json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };


  signout = (req, res) => {
    try {
      // Clear the cookie containing the authentication token
      res.clearCookie("token", {
        secure: true, // set to true if you're using https
        httpOnly: true,
        sameSite: "none",
      });
  
      // Optionally, you can send a response indicating successful logout
      res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
}

module.exports.AuthController = new AuthController();
