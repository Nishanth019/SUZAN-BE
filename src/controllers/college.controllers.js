const { User } = require("../models/User.model.js");
const { College } = require("../models/College.model.js");

class CollegeController {
  // Get all verified colleges
  getAllVerifiedColleges = async (req, res) => {
    try {
      console.log(1);
      const colleges = await College.find({ isVerified: true });
      console.log(2);
      res.status(200).json({ colleges: colleges, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };

  // Get all colleges
  getAllColleges = async (req, res) => {
    try {
      const colleges = await College.find({});
      res.status(200).json({ colleges: colleges, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };

  // Get college from ID
  getCollegeFromId = async (req, res) => {
    try {
      const { id } = req.params;
      const college = await College.findOne({ _id: id });

      if (!college) {
        return res
          .status(404)
          .json({ error: "College not found", success: false });
      }

      res.status(200).json({ college: college, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };

  // Delete college
  deleteCollege = async (req, res) => {
    try {
      const { id } = req.params;
      const college = await College.findByIdAndDelete(id);

      if (!college) {
        return res
          .status(404)
          .json({ error: "College not found", success: false });
      }

      res
        .status(200)
        .json({ message: "College deleted successfully", success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };

  // Update college
  updateCollege = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedCollege = await College.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!updatedCollege) {
        return res
          .status(404)
          .json({ error: "College not found", success: false });
      }

      res.status(200).json({
        college: updatedCollege,
        success: true,
        message: "College Details updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };

  // uploadLogo = async (req, res) => {
  //   try {
  //     // console.log(1, req.file,);
  //     const { id } = req.user;
  //     const imageUrl = req.file.location; // Assuming Multer-S3 provides 'location' for the uploaded file

  //     const updatedUser = await User.findByIdAndUpdate(
  //       id,
  //       { picture: imageUrl },
  //       { new: true }
  //     );

  //     if (!updatedUser) {
  //       return res
  //         .status(404)
  //         .json({ success: false, message: "User not found" });
  //     }

  //     res.status(200).json({
  //       success: true,
  //       message: "User picture uploaded successfully",
  //       user: updatedUser,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ success: false, error: "Internal Server Error" });
  //   }
  // };

  uploadLogo = async (req, res) => {
    try {
      const pictureUrl = req.file.location; // Assuming Multer-S3 provides 'location' for the uploaded file
      console.log(pictureUrl);
      res.status(200).json({
        success: true,
        message: "Logo added successfully",
        picture: pictureUrl,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };

  updateLogo = async (req, res) => {
    try {
      // console.log(1, req.file, req.user.id);
      const { id } = req.params;
      console.log(22,id)
      const logoUrl = req.file.location; 
      const updatedCollege = await College.findByIdAndUpdate(
        id,
        { college_logo: logoUrl },
        { new: true }
      );
      
      if (!updatedCollege) {
        return res
          .status(404)
          .json({ success: false, message: "College not found" });
      }

      res.status(200).json({
        success: true,
        message: "College logo updated successfully",
        college: updatedCollege,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };
}
module.exports.CollegeController = new CollegeController();
