// Import necessary modules
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import custom modules
const controller = require("../controller/Controller");
const authenticateToken = require("../Auth/Auth");
const connection = require("../database/db");

// Initialize the application
const app = express();
const PORT = process.env.PORT || 8080;

// Connect to the database
connection();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

/**
 * User Routes
 */

// Register a new user
app.post("/registeruser", async (req, res) => {
  try {
    const result = await controller.createUser(req.body);
    res.status(result.status).json(result);
  } catch (error) {
    // Handle unexpected errors
    res.status(error.status || 500).json({
      message:
        error.message || "An unexpected error occurred while registering user.",
    });
  }
});

// Log in an existing user
app.post("/loginuser", async (req, res) => {
  try {
    const result = await controller.loginUser(req.body);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        error.message || "An unexpected error occurred while logging in user.",
    });
  }
});

// Update user details
app.put("/updateuser/:id", authenticateToken, async (req, res) => {
  try {
    const result = await controller.updateUser(req.params.id, req.body);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        error.message || "An unexpected error occurred while updating user.",
    });
  }
});

// Delete a user
app.delete("/deleteuser/:id", authenticateToken, async (req, res) => {
  try {
    const result = await controller.deleteUser(req.params.id);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        error.message || "An unexpected error occurred while deleting user.",
    });
  }
});

/**
 * Task Routes
 */

// Create a new task
app.post("/createtask", authenticateToken, async (req, res) => {
  try {
    const result = await controller.createTask(req.body);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        error.message || "An unexpected error occurred while creating task.",
    });
  }
});

// Get task details by task ID
app.get("/readtaskbyid/:id", authenticateToken, async (req, res) => {
  try {
    const result = await controller.readTaskById(req.params.id);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        error.message ||
        "An unexpected error occurred while fetching task by ID.",
    });
  }
});

// Get all tasks by user ID
app.get("/readtasksbyuid/:id", authenticateToken, async (req, res) => {
  try {
    const result = await controller.readTasksByUserId(req.params.id);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        error.message ||
        "An unexpected error occurred while fetching tasks by user ID.",
    });
  }
});

// Update a task by task ID
app.put("/updatetaskbyid/:id", authenticateToken, async (req, res) => {
  try {
    const result = await controller.updateTaskById(req.params.id, req.body);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        error.message || "An unexpected error occurred while updating task.",
    });
  }
});

// Delete a task by task ID
app.delete("/deletetaskbyid/:id", authenticateToken, async (req, res) => {
  try {
    const result = await controller.deleteTaskById(req.params.id);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        error.message || "An unexpected error occurred while deleting task.",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
