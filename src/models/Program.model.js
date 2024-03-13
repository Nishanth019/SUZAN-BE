const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define Program Schema
const programSchema = new Schema({
    program_name: {
        type: String,
        required: true,
        unique: true
    },
    college: {
        type: Schema.Types.ObjectId,
        ref: 'College',
        required: true
    },
    field_of_study: {
        type: Schema.Types.ObjectId,
        ref: 'FieldOfStudy',
        required: true
    }
});

exports.Program = mongoose.model("Program", programSchema);
