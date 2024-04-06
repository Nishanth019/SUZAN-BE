const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define Field of Study Schema
const linkSchema = new Schema({
    link_name: {
        type: String,
        // required: true,
        // unique: true
    },
    link_url:{
        type: String,
        // required: true,
        // unique: true
    },
    course:{
        type: Schema.Types.ObjectId,
        ref: 'Course',
        // required: true
    }
});

exports.Link= mongoose.model("Link", linkSchema );
