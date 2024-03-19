const express = require("express");
const router = express.Router();
const { CourseController } = require("../controllers/course.controllers.js");

// Create program under a college
router.post("/colleges/:collegeId/programs", CourseController.createProgram);

// Update program
router.put("/programs/:programId", CourseController.updateProgram);

// Delete program
router.delete("/programs/:programId", CourseController.deleteProgram);

// Get all programs
router.get("/programs", CourseController.getAllPrograms);

// Get program by ID
router.get("/programs/:programId", CourseController.getProgramById);

// Create field of study under a program
router.post(
  "/programs/:programId/field-of-studies",
  CourseController.createFieldOfStudy
);

// Update field of study
router.put(
  "/field-of-studies/:fieldOfStudyId",
  CourseController.updateFieldOfStudy
);

// Delete field of study
router.delete(
  "/field-of-studies/:fieldOfStudyId",
  CourseController.deleteFieldOfStudy
);

// Get all fields of study
router.get("/field-of-studies", CourseController.getAllFieldsOfStudy);

// Get field of study by ID
router.get(
  "/field-of-studies/:fieldOfStudyId",
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
router.get("/semesters", CourseController.getAllSemesters);

// Get semester by ID
router.get("/semesters/:semesterId", CourseController.getSemesterById);

// Create course under a semester
router.post("/semesters/:semesterId/courses", CourseController.createCourse);

// Update course
router.put("/courses/:courseId", CourseController.updateCourse);

// Delete course
router.delete("/courses/:courseId", CourseController.deleteCourse);

// Get all courses
router.get("/courses", CourseController.getAllCourses);

// Get course by ID
router.get("/courses/:courseId", CourseController.getCourseById);

module.exports.CourseRouter = router;
