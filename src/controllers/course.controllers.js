// Import required modules
const { Semester } = require("../models/Semester.model.js");
const { FieldOfStudy } = require("../models/FieldOfStudy.model.js");
const { Program } = require("../models/Program.model.js");
const { Course } = require("../models/Course.model.js");
const { Pdf } = require("../models/pdf.model.js");
const { Link } = require("../models/link.model.js");
const { CourseViews }= require("../models/CourseViews.model.js")

// const { FieldOfStudy } = require("../models/FieldOfStudy.model.js");

// Define CourseController class
class CourseController {
  // Create program under a college
  createProgram = async (req, res) => {
    try {
      const { programName, programFullName, semestersCount } = req.body; // Extract program details from request body
      // console.log(55,req.user)
      const collegeId = req.user.college; // Extract collegeId from req.user
      // console.log(88,req.user,req.user.college)
      if (!programName || !programFullName || !semestersCount) {
        return res
          .status(400)
          .json({ error: "Missing required fields", success: false });
      }

      const existingProgram = await Program.findOne({
        college: collegeId,
        $or: [
          { program_name: programName },
          { program_fullname: programFullName },
        ],
      });
      if (existingProgram) {
        return res.status(400).json({
          error: "Program with this name or full name already exists",
          success: false,
        });
      }

      // Create the program
      const program = new Program({
        program_name: programName,
        program_fullname: programFullName,
        college: collegeId,
        no_of_semester: semestersCount,
      });

      await program.save();

      // Create semesters
      for (let i = 1; i <= semestersCount; i++) {
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
      const { programId, programFullName } = req.body; // Extract update data from request body
      console.log(89, req.user);
      const collegeId = req.user.college; // Extract collegeId from req.user
      // console.log(90, collegeId);
      // Check if any of the fields are undefined
      if (!programId || !programFullName) {
        return res
          .status(400)
          .json({ error: "Pleass provide all necessary data", success: false });
      }
      const existingProgram = await Program.findOne({
        college: collegeId,
        program_fullname: programFullName,
      });
      if (existingProgram) {
        return res.status(400).json({
          error: "Program with this  full name already exists",
          success: false,
        });
      }
      // Update the program
      const updatedProgram = await Program.findByIdAndUpdate(
        programId,
        {
          program_fullname: programFullName,
        },
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
      console.log(100, req.body);
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
      console.log(121, collegeId);
      const programs = await Program.find({ college: collegeId });
      console.log("asd", programs);
      res.status(200).json({ programs: programs, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };

  // Get all programs by college ID
getAllProgramsByCollegeId = async (req, res) => {
  try {
    const { collegeId } = req.params; // Extract college ID from request parameters
    if (!collegeId) {
      return res
        .status(400)
        .json({ error: "College ID is required", success: false });
    }

    const programs = await Program.find({ college: collegeId }); 
    res.status(200).json({ programs: programs, success: true });
  } catch (error) {
    console.error("Error fetching programs by college ID:", error);
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

  async searchProgram(req, res) {
    try {
      const { searchTerm } = req.query;
      const collegeId = req.user.college;
      const baseQuery = { college: collegeId };
      console.log(123, searchTerm, baseQuery);
      if (searchTerm) {
        baseQuery.$or = [
          { program_name: { $regex: searchTerm, $options: "i" } },
          { program_fullname: { $regex: searchTerm, $options: "i" } },
        ];
      }
      const programs = await Program.find(baseQuery);

      res.status(200).json({ programs: programs, success: true });
    } catch (error) {
      console.error("Search Program Error:", error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  }

  // Create field of study under a program
  createFieldOfStudy = async (req, res) => {
    try {
      const { programId, field_of_studyname, field_of_studyfullname } =
        req.body; // Extract field of study details from request body
      const collegeId = req.user.college; // Extract collegeId from req.use
      // Check if the program exists
      const program = await Program.findById(programId);
      if (!program) {
        return res
          .status(404)
          .json({ error: "Program not found", success: false });
      }
      if (!field_of_studyname) {
        return res
          .status(404)
          .json({ error: "field of study name not found", success: false });
      }
      if (!field_of_studyfullname) {
        return res
          .status(404)
          .json({ error: "field of study fullname not found", success: false });
      }

      // console.log("nani", field_of_studyname, field_of_studyfullname)
      // Create the field of study
      const existingFieldOfStudy = await FieldOfStudy.findOne({
        college: collegeId,
        program: programId,
        $or: [
          { field_of_studyname: field_of_studyname },
          { field_of_studyfullname: field_of_studyfullname },
        ],
      });

      if (existingFieldOfStudy) {
        return res.status(400).json({
          error: "Field of study already exists",
          success: false,
        });
      }
      const fieldOfStudy = new FieldOfStudy({
        field_of_studyname: field_of_studyname,
        field_of_studyfullname: field_of_studyfullname,
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
      console.log(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };

  // Update field of study
  updateFieldOfStudy = async (req, res) => {
    try {
      const { fieldOfStudyId } = req.params; // Extract fieldOfStudyId from request parameters
      const { programId, field_of_studyname, field_of_studyfullname } =
        req.body; // Extract update data from request body
      const collegeId = req.user.college;
      console.log(
        22,
        fieldOfStudyId,
        programId,
        field_of_studyname,
        field_of_studyfullname
      );
      //  console.log(1, programId, fieldOfStudyId, field_of_studyname, field_of_studyfullname);
      // console.log("nannni: ",fieldOfStudyId, field_of_studyname, field_of_studyfullname)
      // Check if any of the fields are undefined
      if (!field_of_studyname || !field_of_studyfullname) {
        return res
          .status(400)
          .json({ error: "Please provide all necessary data", success: false });
      }

      // Check if the field of study exists
      const existingFieldOfStudy = await FieldOfStudy.findOne({
        college: collegeId,
        program: programId,
              
          field_of_studyfullname: field_of_studyfullname ,
      
      });

      if (existingFieldOfStudy) {
        return res.status(400).json({
          error: "Field of study already exists",
          success: false,
        });
      }
      // Update the field of study
      const updatedFieldOfStudy = await FieldOfStudy.findByIdAndUpdate(
        fieldOfStudyId,
        {
          field_of_studyname: field_of_studyname,
          field_of_studyfullname: field_of_studyfullname,
        },
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
      console.log(req.params.id);
      const programId = req.params.id;

      const fieldsOfStudy = await FieldOfStudy.find({
        program: programId,
      });
      // console.log(22, fieldsOfStudy);
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
      // console.log(1, fieldOfStudyId);
      const fieldOfStudy = await FieldOfStudy.findById({ _id: fieldOfStudyId });
      // console.log(2, fieldOfStudy);
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
  //get all fieldofstudy of a college
  getAllFieldOfStudyOfCollege = async (req, res) => {
    try {
      console.log(523);
      const collegeId = req.user.college;
      //find first program using that college id
      // const programId= await Program.findOne({college: collegeId});

      const fieldsOfStudy = await FieldOfStudy.find({
        college: collegeId,
      });
      console.log(22, fieldsOfStudy);
      res.status(200).json({ fieldsOfStudy: fieldsOfStudy, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };

  getAllSemestersByFieldOfStudy = async (req, res) => {
    try {
      const { fieldOfStudyId } = req.params;
      console.log("gfgg", req.params);
      console.log("gfgg", fieldOfStudyId);
      // Find the field of study by its ID
      const fieldOfStudy = await FieldOfStudy.findOne({ _id: fieldOfStudyId });

      // If field of study is not found, return an error response
      if (!fieldOfStudy) {
        return res.status(404).json({ error: "Field of study not found" });
      }

      // Extract semester ids from the field of study
      const semesterIds = fieldOfStudy.semester;

      // Fetch each semester by its id
      const semesters = await Promise.all(
        semesterIds.map(async (semesterId) => {
          const semester = await Semester.findById(semesterId);
          return semester;
        })
      );

      // Return the fetched semesters
      res.status(200).json({ semesters: semesters, success: true });
    } catch (error) {
      console.error("Error in getAllSemestersByFieldOfStudy:", error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };

  getSemesterByCourseId = async (req, res) => {
    try {
      const { courseId } = req.params;
      // Find the course by its ID
      const course = await Course.findById(courseId);

      // If course is not found, return an error response
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Fetch the semester by its ID
      const semester = await Semester.findById(course.semester);

      // If semester is not found, return an error response
      if (!semester) {
        return res.status(404).json({ error: "Semester not found" });
      }

      // Return the fetched semester
      res.status(200).json({ semester: semester, success: true });
    } catch (error) {
      console.error("Error in getSemesterByCourseId:", error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };

  async searchFieldOfStudy(req, res) {
    try {
      const { searchTerm, programId } = req.body; // Extract programId from body
      const collegeId = req.user.college;
      const baseQuery = { college: collegeId };

      if (searchTerm) {
        baseQuery.$or = [
          { field_of_studyname: { $regex: searchTerm, $options: "i" } },
          { field_of_studyfullname: { $regex: searchTerm, $options: "i" } },
        ];
      }

      // Add programId to the query if provided
      if (programId) {
        baseQuery.program = programId;
      }

      const fieldsOfStudy = await FieldOfStudy.find(baseQuery);

      res.status(200).json({ fieldsOfStudy: fieldsOfStudy, success: true });
    } catch (error) {
      console.error("Search Field of Study Error:", error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  }

  // Helper function to create a single PDF
  async createPdf(pdfData) {
    console.log(123,pdfData)
    try {
      if (!pdfData || !pdfData.pdf_name || !pdfData.pdf_url) {
        console.log("No PDF data provided, skipping PDF creation.");
        return;
      }
      const { pdf_name, pdf_url } = pdfData;
      const pdf = new Pdf({ pdf_name, pdf_url });
      return await pdf.save();
    } catch (error) {
      console.error("Error in createPdf:", error.message);
      throw new Error("Failed to create PDF");
    }
  }

  // Helper function to create a single link
  async createLink(linkData) {
    try {
      if (!linkData || !linkData.link_name || !linkData.link_url) {
        console.log("No Links data provided, skipping link creation.");
        return null;
      }
      const { link_name, link_url } = linkData;
      const link = new Link({ link_name, link_url });
      return await link.save();
    } catch (error) {
      console.error("Error in createLink:", error.message);
      throw new Error("Failed to create link");
    }
  }

  // Helper function to create multiple PDFs
  async createMultiplePdfs(pdfDataArray) {
    try {
      if (!Array.isArray(pdfDataArray)) {
        console.log("Invalid PDF data array");
        return;
      }
      const pdfs = await Promise.all(
        pdfDataArray.map(async (pdfData) => await this.createPdf(pdfData))
      );
      return pdfs;
    } catch (error) {
      console.error("Error in createMultiplePdfs:", error.message);
      throw new Error("Failed to create multiple PDFs");
    }
  }

  // Helper function to create multiple links
  async createLinks(linkDataArray) {
    try {
      if (!Array.isArray(linkDataArray)) {
        console.log("Invalid link data array");
        return;
      }
      const links = await Promise.all(
        linkDataArray.map(async (linkData) => await this.createLink(linkData))
      );
      return links;
    } catch (error) {
      console.error("Error in createLinks:", error.message);
      throw new Error("Failed to create multiple links");
    }
  }

  // Controller to get media by course ID
  getMediaByCourseId = async (req, res) => {
    try {
      const { courseId } = req.params;
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      const syllabus = course.syllabus_pdf
        ? await Pdf.findById(course.syllabus_pdf)
        : null;

      const resourcesPdf = course.resources_pdf.length
        ? await Pdf.find({ _id: { $in: course.resources_pdf } })
        : [];

      const resourcesLinks = course.resources_links.length
        ? await Link.find({ _id: { $in: course.resources_links } })
        : [];

      const pyqPdf = course.pyq_pdf.length
        ? await Pdf.find({ _id: { $in: course.pyq_pdf } })
        : [];

      const pyqLinks = course.pyq_links.length
        ? await Link.find({ _id: { $in: course.pyq_links } })
        : [];
      const videoLinks = course.video_links.length
        ? await Link.find({ _id: { $in: course.video_links } })
        : [];

      res.status(200).json({
        course: course,
      
        syllabus: syllabus,
        resourcesPdf: resourcesPdf,
        resourcesLinks: resourcesLinks,
        pyqPdf: pyqPdf,
        pyqLinks: pyqLinks,
        videoLinks: videoLinks,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };

  // Controller to create a course
  createCourse = async (req, res) => {
    try {
      const {
        program,
        field_of_study,
        semester,
        course_name,
        course_code,
        // instructor_name,
        // instructor_photo,
        course_type,
        credits,
        syllabus,
        resource_links = [],
        resource_pdfs = [],
        pyq_links = [],
        pyq_pdfs = [],
        video_links = [],
      } = req.body;

      const collegeId = req.user.college; // Extract collegeId from req.user

      // Create PDF for syllabus (only if syllabus data is provided)
      let syllabusPdf = null;
      console.log(1234,syllabus)
      if (syllabus) {
        syllabusPdf = await this.createPdf(
          {pdf_name: "Syllabus",
          pdf_url: syllabus,}
        );
      }
      console.log("check", syllabusPdf);
      // Create links for resource links and PYQs links (only if data is provided)
      const resourceLinkDocuments = resource_links.length
        ? await this.createLinks(resource_links)
        : [];
      const pyqLinkDocuments = pyq_links.length
        ? await this.createLinks(pyq_links)
        : [];
      const videoLinkDocuments = video_links.length
        ? await this.createLinks(video_links)
        : [];

      // Create PDFs for resource PDFs and PYQs PDFs (only if data is provided)
      const resourcePdfDocuments = resource_pdfs.length
        ? await this.createMultiplePdfs(resource_pdfs)
        : [];
      const pyqPdfs = pyq_pdfs.length
        ? await this.createMultiplePdfs(pyq_pdfs)
        : [];

      // Create the course
      const course = new Course({
        course_name,
        semester,
        field_of_study,
        program,
        college: collegeId,
        course_code,
        // instructor_name,
        // instructor_photo,
        course_type,
        credits,
        syllabus_pdf: syllabusPdf ? syllabusPdf._id : null,
        resources_pdf: resourcePdfDocuments.map((pdf) => pdf._id),
        resources_links: resourceLinkDocuments.map((link) => link._id),
        pyq_pdf: pyqPdfs.map((pdf) => pdf._id),
        pyq_links: pyqLinkDocuments.map((link) => link._id),
        video_links: videoLinkDocuments.map((link) => link._id),
      });

      await course.save();

      res.status(201).json({
        course: course,
        success: true,
        message: "Course created successfully",
      });
    } catch (error) {
      console.error("Error in createCourse:", error.message);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };

  //updateCourse
  updateCourse = async (req, res) => {
    try {
      const {
        course_name,
        course_code,
        // instructor_name,
        // instructor_photo,
        course_type,
        credits,
        syllabus,
        resource_links,
        resource_pdfs,
        pyq_links,
        pyq_pdfs,
        video_links,
      } = req.body;

      const courseId = req.params.courseId;
      // console.log(1,syllabus)
      // Update PDFs for syllabus
      const updatedSyllabusPdf = await this.createPdf({
        pdf_name: "Syllabus",
        pdf_url: syllabus,
      });

      // Update links for resources and PYQs
      const updatedResourceLinkDocuments = await this.createLinks(
        resource_links
      );
      const updatedPyqLinkDocuments = await this.createLinks(pyq_links);
      console.log(1,video_links)
      const updatedVideoLinkDocuments = await this.createLinks(video_links);

      // Update PDFs for resources and PYQs
      const updatedResourcePdfDocuments = await this.createMultiplePdfs(
        resource_pdfs
      );
      const updatedPyqPdfs = await this.createMultiplePdfs(pyq_pdfs);

      // Construct the $set and $unset objects dynamically
      const updateFields = {
        course_name,
        course_code,
        // instructor_name,
        // instructor_photo,
        course_type,
        credits,
        syllabus_pdf: updatedSyllabusPdf,
        resources_pdf:
          updatedResourcePdfDocuments?.length > 0
            ? updatedResourcePdfDocuments.map((pdf) => pdf._id)
            : [],
        resources_links:
          updatedResourceLinkDocuments?.length > 0
            ? updatedResourceLinkDocuments.map((link) => link._id)
            : [],
        pyq_pdf:
          updatedPyqPdfs?.length > 0
            ? updatedPyqPdfs.map((pdf) => pdf._id)
            : [],
        pyq_links:
          updatedPyqLinkDocuments?.length > 0
            ? updatedPyqLinkDocuments.map((link) => link._id)
            : [],
        video_links:
          updatedVideoLinkDocuments?.length > 0
            ? updatedVideoLinkDocuments.map((link) => link._id)
            : [],
      };

      // Prepare $unset for fields that should be removed (null or empty)
      const unsetFields = {};
      if (!updatedSyllabusPdf) {
        unsetFields.syllabus_pdf = "";
      }

      // Combine $set and $unset
      const updateOptions = {
        $set: updateFields,
        ...(Object.keys(unsetFields).length && { $unset: unsetFields }),
      };

      // Update the course
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        updateOptions,
        { new: true }
      );

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
      const { deletingCourseId } = req.params; // Extract courseId from request parameters
      console.log(789, deletingCourseId);
      // Delete the course
      const deletedCourse = await Course.findByIdAndDelete(deletingCourseId);

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
  getCourses = async (req, res) => {
    try {
      // console.log(23456789034567);
      const { programId, fieldOfStudyId, semesterId } = req.body;
      // console.log(123, programId, fieldOfStudyId, semesterId);

      // console.log(23456789034567);
      const collegeId = req.user.college;

      let query = { college: collegeId };

      if (programId) {
        query.program = programId;
      }

      if (fieldOfStudyId) {
        query.field_of_study = fieldOfStudyId;
      }

      if (semesterId) {
        query.semester = semesterId;
      }

      const courses = await Course.find(query);
      res.status(200).json({ courses: courses, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };

  //get all courses of the field of study
  getAllCoursesOfFieldOfStudy = async (req, res) => {
    try {
      const { programId, fieldOfStudyId } = req.query;
        // console.log(1234444, programId, fieldOfStudyId);
        
        // console.log(23456789034567);
        const collegeId = req.user.college;
        // console.log(1234444, programId, fieldOfStudyId, collegeId);

        let query = { college: collegeId };

        if (programId) {
          query.program = programId;
        }

        if (fieldOfStudyId) {
          query.field_of_study = fieldOfStudyId;
        }

        const courses = await Course.find(query);
        res.status(200).json({ courses: courses, success: true });
    }
     catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };
  //get all courses of a college
  getAllCoursesOfCollege = async (req, res) => {
    try {
      const collegeId = req.user.college;
      const courses = await Course.find({ college: collegeId });
      const courseCount = await Course.countDocuments({ college: collegeId });
      res
        .status(200)
        .json({ courseCount: courseCount, courses: courses, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };

  //get number of visits of any course
  incrementCourseViews = async (req, res) => {
    try {
      console.log("tommy 123");
      const collegeId = req.user.college;
      console.log(collegeId);
      // Assuming the college ID is stored in req.user.college

      // Increment the course_views or create a new document if it doesn't exist
      console.log("hiiiiiiiiiias132sa13212311as3");
      let courseViews = await CourseViews.findOneAndUpdate(
        { college: collegeId },
        { $inc: { course_views: 1 } },
        { new: true, upsert: true }
      );

      // If the document was upserted, check if it was newly created
      if (!courseViews) {
        courseViews = new CourseViews({ college: collegeId, course_views: 1 });
        await courseViews.save();
      }
      res.status(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Errors", success: false });
    }
  };

  //get courseviews of a particular college
  getCourseViews = async (req, res) => {
    try {
      const collegeId = req.user.college;
      // Construct base query object with collegeId
      console.log("hi nani 1", collegeId);
      const courseViews = await CourseViews.findOne({ college: collegeId });
      console.log("hi nani 1", courseViews);
      res
        .status(200)
        .json({ courseViews: courseViews.course_views, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Errors", success: false });
    }
  };

  async searchCourses(req, res) {
    try {
      let { programId, fieldOfStudyId, semesterId, searchTerm } = req.body;
      console.log(69, programId, fieldOfStudyId, semesterId, searchTerm);
      const collegeId = req.user.college;

      // Construct base query object with collegeId
      const baseQuery = { college: collegeId };

      // If searchTerm exists, add it to the query using $or operator
      if (searchTerm) {
        baseQuery.$or = [
          { course_name: { $regex: searchTerm, $options: "i" } },
        ];
      }

      // Add programId, fieldOfStudyId, and semesterId to the query if provided
      if (programId) {
        baseQuery.program = programId;
      }
      if (fieldOfStudyId) {
        baseQuery.field_of_study = fieldOfStudyId;
      }
      if (semesterId) {
        baseQuery.semester = semesterId;
      }

      // Perform the course search using the constructed query
      const courses = await Course.find(baseQuery);

      // Return the courses found
      return res.status(200).json({ courses: courses, success: true });
    } catch (error) {
      console.error("Search Courses Error:", error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  }

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
      res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        file: fileUrl,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };

  uploadPicture = async (req, res) => {
    try {
      const pictureUrl = req.file.location; // Assuming Multer-S3 provides 'location' for the uploaded file
      console.log(pictureUrl);
      res.status(200).json({
        success: true,
        message: "Picture added successfully",
        picture: pictureUrl,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };
}

// Export an instance of CourseController
module.exports.CourseController = new CourseController();
