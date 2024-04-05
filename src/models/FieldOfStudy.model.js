const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define Field of Study Schema
const fieldOfStudySchema = new Schema({
    field_of_study_name: {
        type: String,
        required: true,
        unique: true
    },
    program: {
        type: Schema.Types.ObjectId,
        ref: 'Program',
        required: true
    },
    college: {
        type: Schema.Types.ObjectId,
        ref: 'College',
        required: true
    },
    semester: {
        type: Schema.Types.ObjectId,
        ref: 'Semester'
    }
});

exports.FieldOfStudy= mongoose.model("FieldOfStudy", fieldOfStudySchema );
