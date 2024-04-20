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

// Create semester under a field of study
router.post(
  "/field-of-studies/:fieldOfStudyId/semesters",
  CourseController.createSemester
);

// Update semester
router.put("/semesters/:semesterId", CourseController.updateSemester);

// Delete semester
router.delete("/semesters/:semesterId", CourseController.deleteSemester);

// Get all semesters
router.get("/semesters", Auth, CourseController.getAllSemesters);

// Get semester by ID
router.get("/semesters/:semesterId", CourseController.getSemesterById);

//COURSE

// Create course under a semester
router.post("/courses", Auth, CourseController.createCourse);

// Update course
router.put("/courses/:courseId", CourseController.updateCourse);

// Delete course
router.delete("/courses/:courseId", CourseController.deleteCourse);

// Get all courses
router.get("/courses", Auth, CourseController.getAllCourses);

// Get all courses2
router.get("/specificcourses", Auth, CourseController.getAllSpecificCourses);

// Get course by ID
router.get("/courses/:courseId", CourseController.getCourseById);

// upload  file
router.post("/uploadfile", upload.single("file"), CourseController.uploadFile);

module.exports.CourseRouter = router;
