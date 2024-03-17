// Import required modules
const { Semester } = require("../models/Semester.model.js");
const { FieldOfStudy } = require("../models/FieldOfStudy.model.js");
const { Program } = require("../models/Program.model.js");
const { Course } = require("../models/Course.model.js");
// const { FieldOfStudy } = require("../models/FieldOfStudy.model.js");

// Define CourseController class
class CourseController {
  // Create program under a college
  createProgram = async (req, res) => {
    try {
      const { collegeId } = req.params; // Extract collegeId from request parameters
      const { program_name, field_of_study } = req.body; // Extract program details from request body

      // Check if the college exists
      const college = await College.findById({ _id: collegeId });
      if (!college) {
        return res
          .status(404)
          .json({ error: "College not found", success: false });
      }

      // Create the program
      const program = new Program({
        program_name: program_name,
        college: collegeId,
        field_of_study: field_of_study,
      });

      await program.save();

      res.status(201).json({
        program: program,
        success: true,
        message: "Program created successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  // Update program
  updateProgram = async (req, res) => {
    try {
      const { programId } = req.params; // Extract programId from request parameters
      const updateData = req.body; // Extract update data from request body

      // Update the program
      const updatedProgram = await Program.findByIdAndUpdate(
        programId,
        updateData,
        { new: true }
      );

      if (!updatedProgram) {
        return res
          .status(404)
          .json({ error: "Program not found", success: false });
      }

      res.status(200).json({
        program: updatedProgram,
        success: true,
        message: "Program updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  // Delete program
  deleteProgram = async (req, res) => {
    try {
      const { programId } = req.params; // Extract programId from request parameters

      // Delete the program
      const deletedProgram = await Program.findByIdAndDelete(programId);

      if (!deletedProgram) {
        return res
          .status(404)
          .json({ error: "Program not found", success: false });
      }

      res
        .status(200)
        .json({ message: "Program deleted successfully", success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  // Get all programs
  getAllPrograms = async (req, res) => {
    try {
      const programs = await Program.find({});
      res.status(200).json({ programs: programs, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  // Get program by ID
  getProgramById = async (req, res) => {
    try {
      const { programId } = req.params;
      const program = await Program.findById(programId);
      if (!program) {
        return res
          .status(404)
          .json({ error: "Program not found", success: false });
      }
      res.status(200).json({ program: program, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };




  // Create field of study under a program
  createFieldOfStudy = async (req, res) => {
    try {
      const { programId } = req.params; // Extract programId from request parameters
      const { field_of_study_name, semester } = req.body; // Extract field of study details from request body

      // Check if the program exists
      const program = await Program.findById(programId);
      if (!program) {
        return res
          .status(404)
          .json({ error: "Program not found", success: false });
      }

      // Create the field of study
      const fieldOfStudy = new FieldOfStudy({
        field_of_study_name: field_of_study_name,
        program: programId,
        college: program.college, // Associate with the college of the program
        semester: semester,
      });

      // Save the field of study
      await fieldOfStudy.save();

      res.status(201).json({
        fieldOfStudy: fieldOfStudy,
        success: true,
        message: "Field of study created successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  // Update field of study
  updateFieldOfStudy = async (req, res) => {
    try {
      const { fieldOfStudyId } = req.params; // Extract fieldOfStudyId from request parameters
      const updateData = req.body; // Extract update data from request body

      // Update the field of study
      const updatedFieldOfStudy = await FieldOfStudy.findByIdAndUpdate(
        fieldOfStudyId,
        updateData,
        { new: true }
      );

      if (!updatedFieldOfStudy) {
        return res
          .status(404)
          .json({ error: "Field of study not found", success: false });
      }

      res.status(200).json({
        fieldOfStudy: updatedFieldOfStudy,
        success: true,
        message: "Field of study updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  // Delete field of study
  deleteFieldOfStudy = async (req, res) => {
    try {
      const { fieldOfStudyId } = req.params; // Extract fieldOfStudyId from request parameters

      // Delete the field of study
      const deletedFieldOfStudy = await FieldOfStudy.findByIdAndDelete(
        fieldOfStudyId
      );

      if (!deletedFieldOfStudy) {
        return res
          .status(404)
          .json({ error: "Field of study not found", success: false });
      }

      res.status(200).json({
        message: "Field of study deleted successfully",
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  // Get all fields of study
  getAllFieldsOfStudy = async (req, res) => {
    try {
      const fieldsOfStudy = await FieldOfStudy.find({});
      res.status(200).json({ fieldsOfStudy: fieldsOfStudy, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  // Get field of study by ID
  getFieldOfStudyById = async (req, res) => {
    try {
      const { fieldOfStudyId } = req.params;
      const fieldOfStudy = await FieldOfStudy.findById(fieldOfStudyId);
      if (!fieldOfStudy) {
        return res
          .status(404)
          .json({ error: "Field of study not found", success: false });
      }
      res.status(200).json({ fieldOfStudy: fieldOfStudy, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };



  // Create semester under a field of study
  createSemester = async (req, res) => {
    try {
      const { fieldOfStudyId } = req.params; // Extract fieldOfStudyId from request parameters
      const { semesterNumber } = req.body; // Extract semester number from request body

      // Check if the field of study exists
      const fieldOfStudy = await FieldOfStudy.findById(fieldOfStudyId);
      if (!fieldOfStudy) {
        return res
          .status(404)
          .json({ error: "Field of study not found", success: false });
      }

      // Create the semester
      const semester = new Semester({
        semester: semesterNumber,
        field_of_study: fieldOfStudyId,
        program: fieldOfStudy.program, // Associate with the program of the field of study
        college: fieldOfStudy.college, // Associate with the college of the field of study
      });

      // Save the semester
      await semester.save();

      res.status(201).json({
        semester: semester,
        success: true,
        message: "Semester created successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  // Update semester
  updateSemester = async (req, res) => {
    try {
      const { semesterId } = req.params; // Extract semesterId from request parameters
      const updateData = req.body; // Extract update data from request body

      // Update the semester
      const updatedSemester = await Semester.findByIdAndUpdate(
        semesterId,
        updateData,
        { new: true }
      );

      if (!updatedSemester) {
        return res
          .status(404)
          .json({ error: "Semester not found", success: false });
      }

      res.status(200).json({
        semester: updatedSemester,
        success: true,
        message: "Semester updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  // Delete semester
  deleteSemester = async (req, res) => {
    try {
      const { semesterId } = req.params; // Extract semesterId from request parameters

      // Delete the semester
      const deletedSemester = await Semester.findByIdAndDelete(semesterId);

      if (!deletedSemester) {
        return res
          .status(404)
          .json({ error: "Semester not found", success: false });
      }

      res
        .status(200)
        .json({ message: "Semester deleted successfully", success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  // Get all semesters
  getAllSemesters = async (req, res) => {
    try {
      const semesters = await Semester.find({});
      res.status(200).json({ semesters: semesters, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  // Get semester by ID
  getSemesterById = async (req, res) => {
    try {
      const { semesterId } = req.params;
      const semester = await Semester.findById(semesterId);
      if (!semester) {
        return res
          .status(404)
          .json({ error: "Semester not found", success: false });
      }
      res.status(200).json({ semester: semester, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };



  // Create course under a semester
  createCourse = async (req, res) => {
    try {
      const { semesterId } = req.params; // Extract semesterId from request parameters
      const {
        course_name,
        course_code,
        instructor_name,
        instructor_photo,
        course_type,
        credits,
        syllabus_pdf,
        resources,
        pyq,
        notes,
      } = req.body; // Extract course details from request body

      // Check if the semester exists
      const semester = await Semester.findById(semesterId);
      if (!semester) {
        return res
          .status(404)
          .json({ error: "Semester not found", success: false });
      }

      // Create the course
      const course = new Course({
        course_name: course_name,
        semester: semesterId,
        field_of_study: semester.field_of_study,
        program: semester.program,
        college: semester.college,
        course_code: course_code,
        instructor_name: instructor_name,
        instructor_photo: instructor_photo,
        course_type: course_type,
        credits: credits,
        syllabus_pdf: syllabus_pdf,
        resources: resources,
        pyq: pyq,
        notes: notes,
      });

      // Save the course
      await course.save();

      res.status(201).json({
        course: course,
        success: true,
        message: "Course created successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  // Update course
  updateCourse = async (req, res) => {
    try {
      const { courseId } = req.params; // Extract courseId from request parameters
      const updateData = req.body; // Extract update data from request body

      // Update the course
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        updateData,
        { new: true }
      );

      if (!updatedCourse) {
        return res
          .status(404)
          .json({ error: "Course not found", success: false });
      }

      res
        .status(200)
        .json({
          course: updatedCourse,
          success: true,
          message: "Course updated successfully",
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  // Delete course
  deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.params; // Extract courseId from request parameters

      // Delete the course
      const deletedCourse = await Course.findByIdAndDelete(courseId);

      if (!deletedCourse) {
        return res
          .status(404)
          .json({ error: "Course not found", success: false });
      }

      res
        .status(200)
        .json({ message: "Course deleted successfully", success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  // Get all courses
  getAllCourses = async (req, res) => {
    try {
      const courses = await Course.find({});
      res.status(200).json({ courses: courses, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  // Get course by ID
  getCourseById = async (req, res) => {
    try {
      const { courseId } = req.params;
      const course = await Course.findById(courseId);
      if (!course) {
        return res
          .status(404)
          .json({ error: "Course not found", success: false });
      }
      res.status(200).json({ course: course, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
}



// Export an instance of CourseController
module.exports.CourseController = new CourseController();
