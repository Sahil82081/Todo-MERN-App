const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Task text is required'],
    trim: true,
    maxlength: [500, 'Task text cannot exceed 500 characters'],
  },
  done: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'health', 'other'],
    default: 'other',
  },
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);
