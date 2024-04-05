const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Define Reply Schema
const replySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User schema
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Define Comment Schema
const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User schema
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    replies: [replySchema], // Array of replies
  },
  { timestamps: true }
);

// Define Course Schema
const courseSchema = new Schema({
  course_name: {
    type: String,
    required: true,
  },
  semester: {
    type: Schema.Types.ObjectId,
    ref: "Semester",
    required: true,
  },
  field_of_study: {
    type: Schema.Types.ObjectId,
    ref: "FieldOfStudy",
    required: true,
  },
  program: {
    type: Schema.Types.ObjectId,
    ref: "Program",
    required: true,
  },
  college: {
    type: Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  course_code: {
    type: String,
    required: true,
  },
  instructor_name: {
    type: String,
    required: true,
  },
  instructor_photo: {
    type: String,
    required: true,
  },
  course_type: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  syllabus_pdf: {
    type: String,
    required: true,
  },
  resources: [
    {
      type: String,
      required: true,
    },
  ], // Array of resource links
  pyq: [
    {
      type: String,
      required: true,
    },
  ], // Array of PDFs for Previous Year Questions
  notes: [
    {
      type: String,
      required: true,
    },
  ], // Array of notes
  comments: [commentSchema], // Array of comments
});

exports.Course = mongoose.model("Course", courseSchema);
