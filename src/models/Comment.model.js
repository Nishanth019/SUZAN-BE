const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  target: {
    type: Schema.Types.ObjectId,
    required: true // This will hold the ID of the target entity (e.g., course, place)
  },
  targetType: {
    type: String,
    enum: ['course', 'place'], // Define other target types as needed
    required: true
  },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'ReplyComment'
  }]
});

exports.Comment = mongoose.model('Comment', commentSchema);
