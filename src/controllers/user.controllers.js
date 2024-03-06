const { User } = require("../models/User.model.js");
const { College } = require("../models/College.model.js");
const { sendMail } = require("../helpers/Email.Sender.helper.js");
const { sendToken } = require("../helpers/sendToken.helper.js");

class UserController {
    // Admin Signup
    adminSignup = async (req, res) => {
        try {
            const { email, password, name } = req.body;

            // Check if email already exists
            const existingUser = await User.findOne({ email });

            if (existingUser && existingUser.isEmailVerified && existingUser.isUserVerified) {
                return res.status(400).json({ message: 'Account already exists' });
            }

            // if (existingUser && existingUser.isEmailVerified ){

            // }


            let otp = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit OTP

            if (!existingUser) {
                const newUser = new User({
                    email,
                    password,
                    name,
                    otp
                });
                await newUser.save();
            } else {
                existingUser.name = name;
                existingUser.password = password;
                existingUser.otp = otp;
                await existingUser.save();
            }

            sendMail(email, 'OTP', `Your otp is ${otp}`);

            res.status(200).json({ message: 'OTP sent successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Verify OTP for Admin Signup
    verifyOtpForAdmin = async (req, res) => {
        try {
            const { email, otp } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.otp === otp) {
                user.isEmailVerified = true;
                await user.save();
                res.status(200).json({ message: 'OTP verified successfully' });
            } else {
                res.status(400).json({ message: 'Incorrect OTP' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    completeAdminSignup = async (req, res) => {
        try {
            const { email, name, phone, gender, collegeName, streetName, city, state, pincode, country, rollNo, program, branch, batch, emailDomain } = req.body;

            // Check if the college exists or create a new one
            let college = await College.findOne({ college_name: collegeName });
            if (!college) {
                college = new College({
                    college_name: collegeName,
                    street_name: streetName,
                    city: city,
                    state: state,
                    pincode: pincode,
                    country: country,
                    email_domain: emailDomain
                });
                await college.save();
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.name = name;
            user.phone = phone;
            user.gender = gender;
            user.college = college._id; // Associate the user with the college
            user.rollNo = rollNo;
            user.program = program;
            user.branch = branch;
            user.batch = batch;
            user.emailDomain = emailDomain;
            user.isUserVerified = true;
            user.isAdminVerified = true;
            await user.save();

            // Generate JWT token
            const token = await sendToken(user);

            res.status(200).json({ message: 'Details updated successfully', token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    //student signup
    studentSignup = async (req, res) => {
        try {
            const { collegeName, email, password, name } = req.body;

            // Check if email already exists
            const existingUser = await User.findOne({ email });

            if (existingUser && existingUser.isEmailVerified && existingUser.isUserVerified) {
                return res.status(400).json({ message: 'Account already exists' });
            }

            let otp = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit OTP

            if (!existingUser) {
                // Check if the college exists or create a new one
                let college = await College.findOne({ college_name: collegeName });

                const newUser = new User({
                    college: college._id, // Associate the user with the college
                    email,
                    password,
                    name,
                    otp
                });
                await newUser.save();
            } else {
                existingUser.name = name;
                existingUser.password = password;
                existingUser.otp = otp;
                await existingUser.save();
            }

            sendMail(email, 'OTP', `Your otp is ${otp}`);

            res.status(200).json({ message: 'OTP sent successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    // Verify OTP for Student Signup
    verifyOtpForStudent = async (req, res) => {
        try {
            const { email, otp } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.otp === otp) {
                user.isEmailVerified = true;
                await user.save();
                // OTP matched, take to registration page
                res.status(200).json({ message: 'OTP verified successfully' });
            } else {
                res.status(400).json({ message: 'Incorrect OTP' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    completeStudentSignup = async (req, res) => {
        try {
            const { email, name, phone, gender, rollNo, program, branch, batch } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.name = name;
            user.phone = phone;
            user.gender = gender;
            user.roll_no = rollNo;
            user.program = program;
            user.branch = branch;
            user.batch = batch;
            user.isUserVerified = true;
            await user.save();

            // Generate JWT token
            const token = await sendToken(user);

            res.status(200).json({ message: 'Details updated successfully', token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Signin Logic
    signin = async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if user's email is verified
            if (!user.isEmailVerified) {
                return res.status(400).json({ message: 'Email not verified, Please complete the registration process' });
            }

            // Check if user's account is fully verified (for both admin and student)
            if (!user.isUserVerified) {
                return res.status(400).json({ message: 'Account not fully verified. Please complete the registration process' });
            }

            // Check if the user is an admin
            if (user.role === 'admin') {
                // Check if admin account is verified
                if (!user.isAdminVerified) {
                    return res.status(400).json({ message: 'Admin account not verified' });
                }
            }

            // Check if password matches
            if (password !== user.password) {
                return res.status(401).json({ message: 'Incorrect password' });
            }

            // Password matches, generate token
            const token = await sendToken(user);

            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


}

module.exports.UserController = new UserController();