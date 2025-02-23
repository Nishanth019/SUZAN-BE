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
  getUserByEmail = async (req, res) => {
    const { email } = req.query;
    // console.log(100,email)
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

  // Update user by ID
  updateUser = async (req, res) => {
    try {
      const { id } = req.user;
      const updatedData = req.body;
      const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      console.log(1, updatedUser);
      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      res.status(200).json({
        success: true,
        message: "User Details updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };
  updateUserRole = async (req, res) => {
    try {
      const { id } = req.body;
      console.log(2, id);
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
        message: "User Details updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
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
        message: "User Details updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };

  
  //get count of all users of a college
  getUsersCount = async (req, res) => {
    try {
      const { college } = req.user;
      const studentCount = await User.countDocuments({ college });
      res.status(200).json({ studentCount, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };

  //get all admins count of a college
  getAdminsCount = async (req, res) => {
    try {
      const { college } = req.user;
      const adminCount = await User.countDocuments({ college, role: "admin" });
      res.status(200).json({ adminCount, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };


  // Upload user picture
  uploadPicture = async (req, res) => {
    try {
      console.log(1, req.file, req.user.id);
      const { id } = req.user;
      const imageUrl = req.file.location; // Assuming Multer-S3 provides 'location' for the uploaded file

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { picture: imageUrl },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res
        .status(200)
        .json({
          success: true,
          message: "User picture uploaded successfully",
          user: updatedUser,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };

   // Get all admins
   getAllAdmins = async (req, res) => {
    try {
      const { college } = req.user;
      const admins = await User.find({ college, role: "admin" });

      if (!admins || admins.length === 0) {
        return res.status(200).json({
          success: true,
          admins:[],
        });
      }

      res.status(200).json({
        success: true,
        admins,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  };

  // Function to switch main admin access
  handleSwitchAdmin = async (req, res) => {
    try {
      const { currentAdminId, newAdminId } = req.body;
       console.log(currentAdminId,newAdminId);
      // Validation (Optional): You can add checks to ensure valid IDs and roles.

      const currentAdmin = await User.findById(currentAdminId);
      const newAdmin = await User.findById(newAdminId);
        console.log(123, currentAdmin, newAdmin);
      if (!currentAdmin || !newAdmin) {
        return res
          .status(404)
          .json({ success: false, message: "Admin(s) not found" });
      }

      // Directly set the new roles
      currentAdmin.role = "admin";
      newAdmin.role = "mainadmin";

      await Promise.all([currentAdmin.save(), newAdmin.save()]);

      res.status(200).json({ success: true, message: "Main Admin Switched" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };

}

module.exports.UserController = new UserController();
