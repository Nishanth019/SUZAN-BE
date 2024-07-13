const express = require('express');
const router = express.Router();
const { FeedbackController } = require('../controllers/feedback.controllers.js');
const { Auth } = require("../middlewares/auth.middlewares.js");

// Define routes and bind them to controller methods
router.post('/',  Auth, FeedbackController.createFeedback);
router.get('/',  Auth,FeedbackController.getAllFeedbacks);
// router.get('/feedback/:id',  Auth,feedbackController.getFeedbackById);
// router.put('/feedback/:id', Auth, feedbackController.updateFeedback);
// router.delete('/feedback/:id', Auth, feedbackController.deleteFeedback);

module.exports.FeedbackRouter = router;
