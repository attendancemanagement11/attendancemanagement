const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: [true, 'Assigned user is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Overdue'],
      default: 'Pending',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Task', TaskSchema);
