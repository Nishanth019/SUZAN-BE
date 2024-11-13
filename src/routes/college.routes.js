const express = require("express");
const router = express.Router();
const { CollegeController } = require("../controllers/college.controllers.js");
const { Auth } = require("../middlewares/auth.middlewares.js");
const upload = require("../middlewares/file-upload.middlewares.js");
// Route for accesing the college form id
router.get('/getcollegefromid/:id',CollegeController.getCollegeFromId);
 
// Route for accesing all the colleges
router.get('/',CollegeController.getAllColleges); 

// Route for accesing all the verified colleges
router.get('/getverifiedcolleges',CollegeController.getAllVerifiedColleges );

// Route for deleting all the college
router.delete("/:id", CollegeController.deleteCollege);

// Route for accesing all the colleges
router.put("/:id", CollegeController.updateCollege);



router.post(
  "/uploadlogo",
  upload.single("picture"),
  CollegeController.uploadLogo
);

router.post(
  "/updatelogo/:id",
  upload.single("picture"),
  CollegeController.updateLogo
);
module.exports.CollegeRouter = router;