const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define Program Schema
const programSchema = new Schema({
    program_name: {
        type: String,
        required: true,
        unique: true
    },
    program_fullname: {
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
        
    },
    no_of_semester: {
        type: Number,
        required: true, 
    }
});
// programSchema.index({ no_of_semester: 1 }, { unique: false });
exports.Program = mongoose.model("Program", programSchema);
