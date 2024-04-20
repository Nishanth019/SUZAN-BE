const express = require("express");
const router = express.Router();
const { CourseController } = require("../controllers/course.controllers.js");
const { Auth } = require("../middlewares/auth.middlewares.js");
const upload = require("../middlewares/file-upload.middlewares.js");

// PROGRAMS
// Create program under a college
router.post("/programs", Auth, CourseController.createProgram);
// Update program
router.put("/programs/:programId", CourseController.updateProgram);
// Delete program
router.delete("/programs/:programId", CourseController.deleteProgram);
// Get all programs
router.get("/programs", Auth, CourseController.getAllPrograms);
// Get program by ID
router.get("/programs/:programId", CourseController.getProgramById);
// Search and get program by name
router.get("/programs/search", Auth, CourseController.searchProgram);
// GET /api/programs/search?searchTerm=<search_term>


//FIELD OF STUDY
// Create field of study under a program
router.post("/fieldOfStudy", Auth, CourseController.createFieldOfStudy);
// Update field of study
router.put(
  "/fieldOfStudy/:fieldOfStudyId",
  CourseController.updateFieldOfStudy
);
// Delete field of study
router.delete(
  "/fieldOfStudy/:fieldOfStudyId",
  CourseController.deleteFieldOfStudy
);
// Get all fields of study
router.get("/fieldOfStudy/:id", Auth, CourseController.getAllFieldsOfStudy);
// Get field of study by ID
router.get(
  "/fieldOfStudyById/:fieldOfStudyId",
  CourseController.getFieldOfStudyById
);

//COURSE
// Create course under a semester
router.post("/courses", Auth, CourseController.createCourse);
// Update course
router.put("/courses/:courseId", CourseController.updateCourse);
// Delete course
router.delete("/courses/:courseId", CourseController.deleteCourse);
// Get all courses
router.get("/courses", Auth, CourseController.getAllCourses);
// Get all courses by program, field of study
router.get("/specificcourses1", Auth, CourseController.getAllSpecificCourses1);
// Get all courses by program, field of study & semester
router.get("/specificcourses2", Auth, CourseController.getAllSpecificCourses2);

// Get course by ID
router.get("/courses/:courseId", CourseController.getCourseById);

// upload  file
router.post("/uploadfile", upload.single("file"), CourseController.uploadFile);

module.exports.CourseRouter = router;
