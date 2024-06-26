// commentController.js
const { Comment} = require('../models/Comment.model.js');
const {ReplyComment} = require('../models/ReplyComment.model.js')
const { User } = require("../models/User.model.js");
const { College } = require("../models/College.model.js");
const { Course } = require("../models/Course.model.js");

class commentController {

    createMainComment = async (req, res) => {
        try {
            const { content, target, targetType } = req.body;
            const { id } = req.user;
            const newComment = new Comment({
                user: id,
                content,
                target,
                targetType
            });
            await newComment.save();

            if (targetType === "course") {
                // Update the Course model with the new comment
                const course = await Course.findById(target);
                if (!course) {
                    return res.status(404).json({ message: 'Course not found' });
                }
                course.comments.push(newComment._id);
                await course.save();
            }

            res.status(201).json({ message: 'Main comment created successfully', comment: newComment });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    createReplyComment = async (req, res) => {
        try {
            const { content,  mainComment , repliedTo } = req.body;
            const { id } = req.user;
            const newReply = new ReplyComment({ user: id, content, mainComment, repliedTo });
            await newReply.save();
            // Update main comment to include the reply
            await Comment.findByIdAndUpdate( mainComment, { $push: { replies: newReply._id } });
            res.status(201).json({ message: 'Reply comment created successfully', comment: newReply });
  } catch (error) {
            console.error('Error creating reply:', error);
            res.status(500).json({ error: 'Failed to create reply' });
        }
    };

// Controller for creating a reply comment to a reply comment
    createReplyToReply = async (req, res) => {
    try {
      const { content, mainComment, repliedTo } = req.body;
      const {id} = req.user;
      const newReply = new ReplyComment({
        user:id,
        content,
        mainComment,
        repliedTo
      });
      await newReply.save();
      // Update main comment to include the reply
      await Comment.findByIdAndUpdate( mainComment, { $push: { replies: newReply._id } });
      res.status(201).json({ message: 'Reply to reply comment created successfully', reply: newReply });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Controller for getting all comments of a course
    getAllComments = async (req, res) => {
    try {
      const targetId = req.params.targetId;
      const comments = await Comment.find({ target: targetId });
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Controller for deleting a comment or reply comment by the user who commented
   deleteComment = async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      // Check if the user is authorized to delete the comment
      // For simplicity, assuming user ID is sent in request body
      const userId = req.user.id;
      if (String(comment.user) !== userId) {
        return res.status(403).json({ message: 'Unauthorized to delete this comment' });
      }
  
      await Comment.deleteOne({ _id: commentId });
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteReplyComment = async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const comment = await ReplyComment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'ReplyComment not found' });
      }

      const userId = req.user.id;
      if (String(comment.user) !== userId) {
        return res.status(403).json({ message: 'Unauthorized to delete this comment' });
      }
  
      await ReplyComment.deleteOne({ _id: commentId });
      res.status(200).json({ message: 'Reply Comment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Controller for liking a comment
likeComment = async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const userId = req.body.userId;
  
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      // Check if the user has already liked the comment
      const userIndex = comment.likes.indexOf(userId);
      if (userIndex !== -1) {
        // If the user already liked the comment, remove the like (toggle functionality)
        comment.likes.splice(userIndex, 1);
        await comment.save();
        return res.status(200).json({ message: 'Comment dislike toggled successfully' });
      }
  
      // Add the like
      comment.likes.push(userId);
      await comment.save();
      res.status(200).json({ message: 'Comment like toggled successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Controller for liking a reply comment
  likeReplyComment = async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const userId = req.body.userId;
  
      const comment = await ReplyComment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Reply comment not found' });
      }
  
      // Check if the user has already liked the reply comment
      const userIndex = comment.likes.indexOf(userId);
      if (userIndex !== -1) {
        // If the user already liked the reply comment, remove the like (toggle functionality)
        comment.likes.splice(userIndex, 1);
        await comment.save();
        return res.status(200).json({ message: 'Reply comment dislike toggled successfully' });
      }
  
      // Add the like
      comment.likes.push(userId);
      await comment.save();
      res.status(200).json({ message: 'Reply comment like toggled successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

    // Controller for updating a comment
    updateComment = async (req, res) => {
        try {
          const commentId = req.params.commentId;
          const { content } = req.body;
    
          const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content, updatedAt: new Date() },
            { new: true }
          );
    
          if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
          }
    
          res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      };
    
      // Controller for updating a reply comment
      updateReplyComment = async (req, res) => {
        try {
          const commentId = req.params.commentId;
          const { content } = req.body;
    
          const updatedReplyComment = await ReplyComment.findByIdAndUpdate(
            commentId,
            { content, updatedAt: new Date() },
            { new: true }
          );
    
          if (!updatedReplyComment) {
            return res.status(404).json({ message: 'Reply comment not found' });
          }
    
          res.status(200).json({ message: 'Reply comment updated successfully', comment: updatedReplyComment });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      };

    // Controller for getting a comment by id
    getComment = async (req, res) => {
      try {
        const commentId = req.params.commentId;
  
        const comment = await Comment.findById(
          commentId
        );
  
        if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
        }
  
        res.status(200).json({ message: 'Comment fetched successfully', comment: comment });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
  
    // Controller for getting a reply comment by id
    getReplyComment = async (req, res) => {
      try {
        const commentId = req.params.commentId;
  
        const comment = await ReplyComment.findById(
          commentId
        );
  
        if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
        }
  
        res.status(200).json({ message: 'Comment fetched successfully', comment: comment });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };

  // Controller for getting likes of a comment
  getCommentLikes = async (req, res) => {
    try {

      const commentId = req.params.commentId;
      console.log(980,commentId)
      const comment = await Comment.findById(commentId).populate('likes');
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      res.status(200).json({ likes: comment.likes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Controller for getting likes of a reply comment
  getReplyCommentLikes = async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const replyComment = await ReplyComment.findById(commentId).populate('likes');
      if (!replyComment) {
        return res.status(404).json({ message: 'Reply comment not found' });
      }
      res.status(200).json({ likes: replyComment.likes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

}

module.exports.commentController = new commentController();
