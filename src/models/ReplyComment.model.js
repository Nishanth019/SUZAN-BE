const mongoose = require('mongoose');

const Schema = mongoose.Schema; 
const replyCommentSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    mainComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      required: true
    },
    repliedTo: {
      type: Schema.Types.ObjectId,
      ref: 'ReplyComment' // If replying to a reply
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  exports.ReplyComment = mongoose.model('ReplyComment', replyCommentSchema);