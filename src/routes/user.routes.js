const express = require("express");
const router = express.Router();
const { UserController } = require("../controllers/user.controllers.js");
const { Auth } = require("../middlewares/auth.middlewares.js");

// Route for getting current user
router.get("/currentuser", Auth, UserController.getCurrentUser);

// Route for accessing the user by ID
router.get("/:id", UserController.getUserFromId);

// Route for deleting a user by ID
router.delete("/:id", UserController.deleteUser);

// Route for updating a user by ID
router.put("/:id", UserController.updateUser);

module.exports.UserRouter = router;
