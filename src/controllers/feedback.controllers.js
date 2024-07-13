const { Feedback } = require('../models/Feedback.model');

class FeedbackController {
    // Create a new feedback
    createFeedback = async (req, res) => {
        try {
            const { fullname, email, mobile, message } = req.body;
            const collegeId = req.user.college;
            // Create a new feedback entry
            const newFeedback = new Feedback({
                college: collegeId,
                fullname,
                email,
                mobile,
                message,
            });

            // Save the feedback entry to the database
            await newFeedback.save();

            res.status(201).json({ message: 'Feedback created successfully', data: newFeedback });
        } catch (error) {
            res.status(500).json({ message: 'Error creating feedback', error: error.message });
        }
    };

    // Get all feedback entries
    
    getAllFeedbacks = async (req, res) => {
        try {
            const collegeId = req.user.college; 
            const feedbacks = await Feedback.find({ college: collegeId }).sort({ created_at: -1 });
        
            
            res.status(200).json({ feedbacks, success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error', success: false });
        }
    };

    // Get a single feedback entry by ID
    // getFeedbackById = async (req, res) => {
    //     try {
    //         const feedbackId = req.params.id;
    //         const feedback = await Feedback.findById(feedbackId).populate('college');

    //         if (!feedback) {
    //             return res.status(404).json({ message: 'Feedback not found' });
    //         }

    //         res.status(200).json({ message: 'Feedback retrieved successfully', data: feedback });
    //     } catch (error) {
    //         res.status(500).json({ message: 'Error retrieving feedback', error: error.message });
    //     }
    // };

    // Update a feedback entry by ID
    // updateFeedback = async (req, res) => {
    //     try {
    //         const feedbackId = req.params.id;
    //         const updateData = req.body;

    //         const updatedFeedback = await Feedback.findByIdAndUpdate(feedbackId, updateData, { new: true }).populate('college');

    //         if (!updatedFeedback) {
    //             return res.status(404).json({ message: 'Feedback not found' });
    //         }

    //         res.status(200).json({ message: 'Feedback updated successfully', data: updatedFeedback });
    //     } catch (error) {
    //         res.status(500).json({ message: 'Error updating feedback', error: error.message });
    //     }
    // };

    // Delete a feedback entry by ID
    // deleteFeedback = async (req, res) => {
    //     try {
    //         const feedbackId = req.params.id;

    //         const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);

    //         if (!deletedFeedback) {
    //             return res.status(404).json({ message: 'Feedback not found' });
    //         }

    //         res.status(200).json({ message: 'Feedback deleted successfully', data: deletedFeedback });
    //     } catch (error) {
    //         res.status(500).json({ message: 'Error deleting feedback', error: error.message });
    //     }
    // };
}

// Export an instance of CourseController
module.exports.FeedbackController = new FeedbackController();
