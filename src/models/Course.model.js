const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define Course Schema
const courseSchema = new Schema({
    course_name: {
        type: String,
        required: true
    },
    semester: {
        type: Schema.Types.ObjectId,
        ref: 'Semester',
        required: true
    },
    field_of_study: {
        type: Schema.Types.ObjectId,
        ref: 'FieldOfStudy',
        required: true
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
    }
});


exports.Course = mongoose.model("Course", courseSchema);
