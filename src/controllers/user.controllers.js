const { User } = require("../models/User.model.js");

class UserController {
  // get logged in user
  getCurrentUser = async (req, res) => {
    const { email } = req.user;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user,
    });
  };

  deleteUser = async (req, res) => {
    try {
      const { id } = req.user;
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };

  // Update user by ID
  updateUser = async (req, res) => {
    try {
      const { id } = req.user;
      const updatedData = req.body;

      const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
        new: true,
      });

      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };

  getUserFromId = async (req, res) => {
    try {
      console.log(1);
      const { id } = req.params;
      console.log(21, id);
      const user = await User.findOne({ _id: id });
      console.log(22, user);
      if (!user) {
        return res
          .status(404)
          .json({ error: "User not found", success: false });
      }

      res.status(200).json({ user: user, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };

  deleteUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete({ _id: id });

      if (!deletedUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };

  // Update user by ID
  updateUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        { _id: id },
        updatedData,
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };
}

module.exports.UserController = new UserController();
