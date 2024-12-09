// Import Mongoose for database interaction
const mongoose = require("mongoose");

/**
 * Task Schema
 * Represents tasks associated with users.
 */

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [10, "Task title must be at least 10 characters"],
      maxlength: [50, "Task title must not exceed 50 characters"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
      minlength: [10, "Task description must be at least 10 characters"],
      maxlength: [200, "Task description must not exceed 200 characters"],
    },
    isCompleted: {
      type: Boolean,
      default: false, // Default value for task completion status
    },
    dueDate: {
      type: Date,
      default: null, // Optional field for task due date
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

/**
 * User Schema
 * Represents application users.
 */
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [5, "Username must be at least 5 characters"],
      maxlength: [20, "Username must not exceed 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true, // Store emails in lowercase for consistency
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Create and export the models
const userModel = mongoose.model("User", userSchema); // User model
const taskModel = mongoose.model("Task", taskSchema); // Task model

module.exports = {
  userModel, // Export User model
  taskModel, // Export Task model
};
