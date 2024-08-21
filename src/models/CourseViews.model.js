const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Define CourseViews Schema
const courseviewsSchema = new Schema({
  college: {
    type: Schema.Types.ObjectId,
    ref: "College",
  },
  course_views: {
    type: Number,
    default:0
  }
});


exports.CourseViews = mongoose.model("CourseViews", courseviewsSchema);
