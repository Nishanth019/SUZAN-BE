const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define Feedback Schema
const feedbackSchema = new Schema({
    college: {
        type: Schema.Types.ObjectId,
        ref: 'College',
        required: true,
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        // unique: true // Ensure email is unique
    },
    mobile: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});


exports.Feedback = mongoose.model("Feedback", feedbackSchema);
