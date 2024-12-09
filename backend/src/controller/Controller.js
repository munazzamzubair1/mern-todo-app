// Import required modules
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const model = require("../model/Model");

// Helper function to validate MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// User Registration Function
const createUser = async (obj) => {
  try {
    const { username, email, password } = obj;

    // Validate input data
    if (!username || !email || !password) {
      return { message: "All fields are required", status: 400 };
    }

    // Check for existing user with the same email
    const existingUser = await model.userModel.findOne({ email });
    if (existingUser) {
      return { message: "User already exists", status: 409 };
    }

    // Hash the password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user
    const user = await model.userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    // Return success response
    return {
      message: "User registered successfully",
      status: 201,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  } catch (error) {
    console.error("Error during user registration:", error);
    throw { message: "Internal server error", status: 500 };
  }
};

// User Login Function
const loginUser = async (obj) => {
  try {
    const { email, password } = obj;

    // Validate input data
    if (!email || !password) {
      return { message: "All fields are required", status: 400 };
    }

    // Fetch user by email
    const user = await model.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { message: "Invalid email or password", status: 401 };
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    // Return success response
    return {
      message: "Login successful",
      status: 200,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  } catch (error) {
    console.error("Error during user login:", error);
    throw { message: "Internal server error", status: 500 };
  }
};

// Function to update user details
const updateUser = async (id, data) => {
  try {
    if (!isValidId(id)) {
      return { message: "Invalid user ID format", status: 400 };
    }

    // Hash password if being updated
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    // Update user details
    const user = await model.userModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return { message: "User not found", status: 404 };
    }

    return { message: "User updated successfully", status: 200, data: user };
  } catch (error) {
    console.error("Error updating user:", error);
    throw { message: "Internal server error", status: 500 };
  }
};

// Function to delete user
const deleteUser = async (id) => {
  try {
    if (!isValidId(id)) {
      return { message: "Invalid user ID format", status: 400 };
    }

    const user = await model.userModel.findByIdAndDelete(id);

    if (!user) {
      return { message: "User not found", status: 404 };
    }

    return { message: "User deleted successfully", status: 200 };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw { message: "Internal server error", status: 500 };
  }
};

// Task CRUD functions

// Function to create task
const createTask = async (data) => {
  try {
    if (!data.title || !data.description) {
      return { message: "All fields are required", status: 400 };
    }

    const task = await model.taskModel.create(data);

    return { message: "Task created successfully", status: 201, data: task };
  } catch (error) {
    console.error("Error creating task:", error);
    throw { message: "Internal server error", status: 500 };
  }
};

// Function to read task by taskid
const readTaskById = async (id) => {
  try {
    if (!isValidId(id)) {
      return { message: "Invalid task ID format", status: 400 };
    }

    const task = await model.taskModel.findById(id);
    if (!task) {
      return { message: "Task not found", status: 404 };
    }

    return { message: "Task retrieved successfully", status: 200, data: task };
  } catch (error) {
    console.error("Error reading task:", error);
    throw { message: "Internal server error", status: 500 };
  }
};

// Function to read tasks specific to user
const readTasksByUserId = async (userId) => {
  try {
    if (!isValidId(userId)) {
      return { message: "Invalid user ID format", status: 400 };
    }

    const tasks = await model.taskModel.find({ userId });
    if (!tasks.length) {
      return { message: "No tasks found", status: 404 };
    }

    return {
      message: "Tasks retrieved successfully",
      status: 200,
      data: tasks,
    };
  } catch (error) {
    console.error("Error reading tasks:", error);
    throw { message: "Internal server error", status: 500 };
  }
};

// Function to update task by id
const updateTaskById = async (id, data) => {
  try {
    if (!isValidId(id)) {
      return { message: "Invalid task ID format", status: 400 };
    }

    const task = await model.taskModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return { message: "Task not found", status: 404 };
    }

    return { message: "Task updated successfully", status: 200, data: task };
  } catch (error) {
    console.error("Error updating task:", error);
    throw { message: "Internal server error", status: 500 };
  }
};

// Function to delete task by id
const deleteTaskById = async (id) => {
  try {
    if (!isValidId(id)) {
      return { message: "Invalid task ID format", status: 400 };
    }

    const task = await model.taskModel.findByIdAndDelete(id);
    if (!task) {
      return { message: "Task not found", status: 404 };
    }

    return { message: "Task deleted successfully", status: 200 };
  } catch (error) {
    console.error("Error deleting task:", error);
    throw { message: "Internal server error", status: 500 };
  }
};

// Export all controller functions
module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  createTask,
  readTaskById,
  readTasksByUserId,
  updateTaskById,
  deleteTaskById,
};
