// commentRoutes.js
const express = require('express');
const router = express.Router();
const { commentController }= require('../controllers/comment.controllers.js')
const { Auth } = require("../middlewares/auth.middlewares.js");

// Route for creating a main comment under a course
router.post('/target/comment',Auth , commentController.createMainComment);

// Route for creating a reply comment to a main comment
router.post('/comment/reply',Auth ,  commentController.createReplyComment);

// Route for creating a reply comment to a reply comment
router.post('/comment/replytoreply',Auth ,  commentController.createReplyToReply);

// Route for getting all comments of a course
router.get('/target/:targetId/comments',Auth ,  commentController.getAllComments);

// Route for deleting a comment  by the user who commented
router.delete('/comment/:commentId',Auth ,  commentController.deleteComment);

// Route for deleting a reply comment by the user who commented
router.delete('/replycomment/:commentId',Auth ,  commentController.deleteReplyComment);

// Route for liking a comment
router.post('/comment/:commentId/like',Auth ,  commentController.likeComment);

// Route for liking a reply comment
router.post('/replycomment/:commentId/like',Auth ,  commentController.likeReplyComment);

// Route for updating a comment
router.put('/comment/:commentId', Auth, commentController.updateComment);

// Route for updating a reply comment
router.put('/replycomment/:commentId', Auth, commentController.updateReplyComment);

// Route for getting comment by id
router.get('/comment/:commentId', Auth, commentController.getComment);

// Route for getting reply comment by id
router.get('/replycomment/:commentId', Auth, commentController.getReplyComment);

// Route for getting likes of a comment
router.get('/comment/:commentId/likes', Auth, commentController.getCommentLikes);

// Route for getting likes of a reply comment
router.get('/replycomment/:commentId/likes', Auth, commentController.getReplyCommentLikes);



module.exports.CommentRouter = router;

