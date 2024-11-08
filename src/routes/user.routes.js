const express = require("express");
const router = express.Router();
const { UserController } = require("../controllers/user.controllers.js");
const { Auth } = require("../middlewares/auth.middlewares.js");
const upload = require('../middlewares/file-upload.middlewares.js');


// Route for getting current user
router.get("/currentuser", Auth, UserController.getCurrentUser);

// Route for getting a user with email
router.get("/userbyemail", Auth, UserController.getUserByEmail);

// Route for updating a user
router.put("/updateuser", Auth, UserController.updateUser);

// Route for updating a user role
router.put("/updateuserrole", Auth, UserController.updateUserRole);

// Route for deleting a user 
router.delete("/deleteuser", Auth, UserController.deleteUser);

// Route for getting count of all users
router.get("/getuserscount", Auth, UserController.getUsersCount);

// Route for getting count of all admins
router.get("/getadminscount", Auth, UserController.getAdminsCount);

// Route for accessing the user by ID
router.get("/getuser/:id", UserController.getUserFromId);

// Route for deleting a user by ID
router.delete("/deleteuser/:id", UserController.deleteUserById);

// Route for updating a user by ID
router.put("/updateuser/:id", UserController.updateUserById);

// Route for uploading a picture
router.post('/uploadpicture', Auth, upload.single('picture'), UserController.uploadPicture);

// Route for getting all admins
router.get("/getalladmins", Auth, UserController.getAllAdmins);

// Route for switching main admin access 
router.put("/switchmainadmin", Auth, UserController.handleSwitchAdmin);




module.exports.UserRouter = router;
