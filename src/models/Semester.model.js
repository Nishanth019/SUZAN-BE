const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Semester Schema
const semesterSchema = new Schema({
    semester: {
        type: Number,
        required: true
    },
    // field_of_study: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'FieldOfStudy',
    //     required: true
    // },
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
    // course: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Course'
    // }
});

exports.Semester = mongoose.model("Semester", semesterSchema);
