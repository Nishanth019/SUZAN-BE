// User Modal
const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

const userSchema = new Schema({ 
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    gender: {
        type: String
    },
    college: {
        type: Schema.Types.ObjectId,
        ref: 'College'
    },
    roll_no: {
        type: String
    },
    program: {
        type: String
    },
    branch: {
        type: String
    },
    batch: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'superadmin'],
        default: 'student',
        required: true
    },
    otp: {
        type: String
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isAdminVerified: {
        type: Boolean,
        default: false
    },
    isUserVerified: {
        type: Boolean,
        default: false
    }
});


exports.User = mongoose.model("User", userSchema);
