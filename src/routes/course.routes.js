const express = require("express");
const router = express.Router();
const { CourseController } = require("../controllers/course.controllers.js");
const { Auth } = require("../middlewares/auth.middlewares.js");
const upload = require("../middlewares/file-upload.middlewares.js");

// PROGRAMS
// Create program under a college
router.post("/programs", Auth, CourseController.createProgram);
// Update program
router.put("/programs/updateProgram",Auth, CourseController.updateProgram);
// Delete program
router.delete("/programs/:programId", Auth,CourseController.deleteProgram);
// Get all programs
router.get("/programs", Auth, CourseController.getAllPrograms);
// Get program by ID
router.get("/programs/:programId", CourseController.getProgramById);
// Search and get program by name
router.post("/programs/search", Auth, CourseController.searchProgram);
// GET /api/programs/search?searchTerm=<search_term>



//FIELD OF STUDY
// Create field of study under a program
router.post("/fieldOfStudy", Auth, CourseController.createFieldOfStudy);
// Update field of study
router.put(
  "/fieldOfStudy/:fieldOfStudyId",
  Auth,
  CourseController.updateFieldOfStudy
);
// Delete field of study
router.delete(
  "/fieldOfStudy/:fieldOfStudyId",
  Auth,
  CourseController.deleteFieldOfStudy
);
// Get all fields of study
router.get("/fieldOfStudy/:id", Auth, CourseController.getAllFieldsOfStudy);
// Get all fields of study by college id
router.get("/fieldOfStudy", Auth, CourseController.getAllFieldOfStudyOfCollege);
// Get field of study by ID
router.get(
  "/fieldOfStudyById/:fieldOfStudyId",
  CourseController.getFieldOfStudyById
);
router.post("/fieldOfStudy/search", Auth, CourseController.searchFieldOfStudy);

//SEMESTERS
// Get all semesters by fieldOfStudy
router.get("/semester/:fieldOfStudyId", Auth, CourseController.getAllSemestersByFieldOfStudy);
//get Semester By CourseId
router.get("/semester/course/:courseId", Auth, CourseController.getSemesterByCourseId);

//COURSE
// Create course under a semester
router.post("/courses", Auth, CourseController.createCourse);
// Update course
router.put("/courses/:courseId", CourseController.updateCourse);
// Delete course
router.delete("/courses/:deletingCourseId", CourseController.deleteCourse);
// Get all courses
router.post("/getcourses", Auth, CourseController.getCourses);
//get All courses of a college
router.get("/courses/college", Auth, CourseController.getAllCoursesOfCollege);
// Get course by ID
router.get("/courses/:courseId", Auth ,CourseController.getCourseById);

router.patch("/courses/inc", Auth ,CourseController.incrementCourseViews);

//get course views
router.post("/courses/countviews", Auth,CourseController.getCourseViews);
// router.get("/courses/countviews/:id", Auth,CourseController.getCourseViews);

// Search and get course by name
router.post("/courses/search", Auth, CourseController.searchCourses);


// GET /api/courses/search?searchTerm=<search_term>

//pdfs and links
router.get(
  "/courses/media/:courseId",
  Auth,
  CourseController.getMediaByCourseId
);

// upload  file
router.post("/uploadfile", upload.single("file"), CourseController.uploadFile);
//upload picture
router.post("/uploadpicture", upload.single("picture"), CourseController.uploadPicture);


module.exports.CourseRouter = router;
