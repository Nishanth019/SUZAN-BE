const express = require("express");
const router = express.Router();
const { CollegeController } = require("../controllers/college.controllers.js");
const { Auth } = require("../middlewares/auth.middlewares.js");

// Route for accesing the college form id
router.get('/:id',CollegeController.getCollegeFromId);

// Route for accesing all the colleges
router.get('/',CollegeController.getAllColleges);
// Route for deleting all the college
router.delete("/:id", CollegeController.deleteCollege);
// Route for accesing all the colleges
router.put("/:id", CollegeController.updateCollege);

module.exports.CollegeRouter = router;