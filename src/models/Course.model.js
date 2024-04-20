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
    type: Schema.Types.ObjectId,
    ref: 'pdf',
    // required: true
  },
  resources_pdf: [
    {
      type: Schema.Types.ObjectId,
      ref: 'pdf',
    }
  ], // Array of PDF resources
  resources_links: [
    {
      type: Schema.Types.ObjectId,
      ref: 'link',
    }
  ], // Array of link resources
  pyq_pdf: [
    {
      type: Schema.Types.ObjectId,
      ref: 'pdf',
    }
  ], // Array of PDFs for Previous Year Questions
  pyq_links: [
    {
      type: Schema.Types.ObjectId,
      ref: 'link',
    }
  ], // Array of link resources for Previous Year Questions
  comments: [commentSchema], // Array of comments
});

exports.Course = mongoose.model("Course", courseSchema);
