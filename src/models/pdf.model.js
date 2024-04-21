const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Define Field of Study Schema
const pdfSchema = new Schema({
  pdf_name: {
    type: String,
    // required: true,
    // unique: true
  },
  pdf_url: {
    type: String,
    // required: true,
    // unique: true
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    // required: true
  },
});

exports.Pdf = mongoose.model("Pdf", pdfSchema);
