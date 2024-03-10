const express = require("express");
const router = express.Router();
const { UserController } = require("../controllers/user.controllers.js");
const { Auth } = require("../middlewares/auth.middlewares.js");

// Route for getting current user
router.get("/currentuser", Auth, UserController.getCurrentUser);

// Route for updating a user
router.put("/updateuser", Auth, UserController.updateUser);

// Route for deleting a user 
router.delete("/deleteuser", Auth, UserController.deleteUser);

// Route for accessing the user by ID
router.get("/getuser/:id", UserController.getUserFromId);

// Route for deleting a user by ID
router.delete("/deleteuser/:id", UserController.deleteUserById);

// Route for updating a user by ID
router.put("/updateuser/:id", UserController.updateUserById);

module.exports.UserRouter = router;
