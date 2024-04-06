// Import required modules
const { Semester } = require("../models/Semester.model.js");
const { FieldOfStudy } = require("../models/FieldOfStudy.model.js");
const { Program } = require("../models/Program.model.js");
const { Course } = require("../models/Course.model.js");
const { Pdf } = require("../models/Pdf.model.js");
const { Link } = require("../models/Link.model.js");

// const { FieldOfStudy } = require("../models/FieldOfStudy.model.js");

// Define CourseController class
class CourseController {
  // Create program under a college
  createProgram = async (req, res) => {
    try {
      const { program_name, program_fullname, no_of_semester } = req.body; // Extract program details from request body
      // console.log(55,req.user)
      const collegeId = req.user.college; // Extract collegeId from req.user

      // Create the program
      const program = new Program({
        program_name: program_name,
        program_fullname: program_fullname,
        college: collegeId,
        no_of_semester: no_of_semester,
      });

      await program.save();

      // Create semesters
      for (let i = 1; i <= no_of_semester; i++) {
        const semester = new Semester({
          semester: i,
          program: program._id,
          college: collegeId,
        });
        await semester.save();
      }

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
      const collegeId = req.user.college; // Extract collegeId from req.user
      const programs = await Program.find({ college: collegeId });
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
      const { field_of_studyname, programId } = req.body; // Extract field of study details from request body
      const collegeId = req.user.college; // Extract collegeId from req.user

      // Check if the program exists
      const program = await Program.findById(programId);
      if (!program) {
        return res
          .status(404)
          .json({ error: "Program not found", success: false });
      }

      // Create the field of study
      const fieldOfStudy = new FieldOfStudy({
        field_of_studyname: field_of_studyname,
        program: programId,
        college: collegeId,
      });

      // Save the field of study
      await fieldOfStudy.save();

      // Connect semesters to the field of study
      const semesters = await Semester.find({
        program: programId,
        college: collegeId,
      });
      fieldOfStudy.semester = semesters.map((semester) => semester._id);
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
      const { programId } = req.body;
      const collegeId = req.user.college;

      const fieldsOfStudy = await FieldOfStudy.find({
        program: programId,
        college: collegeId,
      });
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
      const { programId } = req.body;
      const { collegeId } = req.user.college;

      const semesters = await Semester.find({
        program: programId,
        college: collegeId,
      });
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

  // Helper function to create a single PDF
  async createPdf(pdfData) {
    try {
      const { pdf_name, pdf_url } = pdfData;
      // console.log(69, pdf_name, pdf_url);
      const pdf = new Pdf({
        pdf_name,
        pdf_url,
      });
      return await pdf.save();
    } catch (error) {
      console.error(error);
      // throw new Error("Failed to create PDF");
    }
  }

  // Helper function to create a single link
  async createLink(linkData) {
    try {
      const { link_name, link_url } = linkData;

      const link = new Link({
        link_name,
        link_url,
      });
      return await link.save();
    } catch (error) {
      console.error(error);
      // throw new Error("Failed to create link");
    }
  }

  // Helper function to create multiple PDFs
  async createMultiplePdfs(pdfDataArray) {
    try {
      // console.log(77,pdfDataArray)
      const pdfs = await Promise.all(
        pdfDataArray.map(async (pdfData) => await this.createPdf(pdfData))
      );
      return pdfs;
    } catch (error) {
      console.error(error);
      // throw new Error("Failed to create multiple PDFs");
    }
  }

  // Helper function to create multiple links
  async createLinks(linkDataArray) {
    try {
      const links = await Promise.all(
        linkDataArray.map(async (linkData) => await this.createLink(linkData))
      );
      // console.log(99,links)
      return links;
    } catch (error) {
      console.error(error);
      // throw new Error("Failed to create multiple links");
    }
  }

  createCourse = async (req, res) => {
    try {
      const {
        program,
        field_of_study,
        semesterId,
        course_name,
        course_code,
        instructor_name,
        instructor_photo,
        course_type,
        credits,
        syllabus,
        resource_links,
        resource_pdfs,
        pyq_links,
        pyq_pdfs,
      } = req.body;

      const semester = await Semester.findById(semesterId);
      if (!semester) {
        return res
          .status(404)
          .json({ error: "Semester not found", success: false });
      }

      // Create PDFs for syllabus, PYQs, and notes
      const syllabusPdf = await this.createPdf(syllabus);
      const pyqPdfs = await this.createMultiplePdfs(pyq_pdfs);

      // Create links for resource links, PYQs links, and notes links
      const resourceLinkDocuments = await this.createLinks(resource_links);
      const pyqLinkDocuments = await this.createLinks(pyq_links);

      // Create PDFs for resource PDFs
      const resourcePdfDocuments = await this.createMultiplePdfs(resource_pdfs);

      // Create the course
      const course = new Course({
        course_name,
        semester: semesterId,
        field_of_study,
        program,
        college: semester.college,
        course_code,
        instructor_name,
        instructor_photo,
        course_type,
        credits,
        syllabus_pdf: syllabusPdf._id,
        resources_pdf: resourcePdfDocuments.map((pdf) => pdf._id),
        resources_links: resourceLinkDocuments.map((link) => link._id),
        pyq_pdf: pyqPdfs.map((pdf) => pdf._id),
        pyq_links: pyqLinkDocuments.map((link) => link._id),
      });

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

      res.status(200).json({
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
      const { programId, fieldOfStudyId, semesterId } = req.body;
      const collegeId = req.user.college;
      const courses = await Course.find({
        program: programId,
        field_of_study: fieldOfStudyId,
        semester: semesterId,
        college: collegeId,
      });
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

      // Upload pdf file
      uploadFile = async (req, res) => {
        try {
          const fileUrl = req.file.location; // Assuming Multer-S3 provides 'location' for the uploaded file
          console.log(fileUrl);
          res.status(200).json({ success: true, message: 'File uploaded successfully', fileUrl: fileUrl });
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
      };
}



// Export an instance of CourseController
module.exports.CourseController = new CourseController();
