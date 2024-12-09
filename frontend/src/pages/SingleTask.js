import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from "../components/Alert"; // Alert component for notifications
import Axios from "./Axios"; // Axios instance for API requests
import { AuthContext } from "../context/ContextApi"; // Auth context for user authentication
import LoadingBar from "react-top-loading-bar"; // Loading bar for progress indication

const SingleTask = () => {
  // State variables
  const [task, setTask] = useState({
    title: "",
    description: "",
    isCompleted: false,
    createdAt: "",
    updatedAt: "",
    dueDate: "",
  }); // Store task details
  const [alertMessage, setAlertMessage] = useState(""); // Alert message
  const [alertType, setAlertType] = useState(""); // Alert type
  const [loading, setLoading] = useState(true); // Loading state
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [taskId, setTaskId] = useState(null); // ID of the task to delete

  const location = useLocation(); // Access route location
  const navigate = useNavigate(); // Navigation hook
  const loadingRef = useRef(null); // Reference for the loading bar
  const { task_id } = location.state; // Retrieve task ID from location state
  const { user } = useContext(AuthContext); // Authenticated user info

  // Fetch task details
  const fetchTask = async () => {
    try {
      if (loadingRef.current) loadingRef.current.continuousStart();
      const { data } = await Axios.get(`/readtaskbyid/${task_id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTask(data.data);
    } catch (error) {
      console.error(error);
      setAlertMessage("Failed to fetch task details.");
      setAlertType("danger");
    } finally {
      if (loadingRef.current) loadingRef.current.complete();
      setLoading(false);
    }
  };

  // Delete task by ID
  const confirmDeleteTask = async () => {
    try {
      const { data } = await Axios.delete(`/deletetaskbyid/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAlertMessage(data.message);
      setAlertType("success");
      setShowModal(false);
      setTimeout(() => navigate("/tasks"), 1500);
    } catch (error) {
      console.error(error);
      setAlertMessage("Failed to delete task.");
      setAlertType("danger");
      setShowModal(false);
    }
  };

  // Navigate to the update task page
  const handleUpdateTask = () => {
    navigate("/updatetask", { state: { task_id: task._id } });
  };

  // Load task details on component mount
  useEffect(() => {
    fetchTask();
  }, [task_id]);

  // Update document title based on task title
  useEffect(() => {
    if (task.title) document.title = task.title;
  }, [task]);

  return (
    <div className="container mt-5">
      {/* Loading bar */}
      <LoadingBar color="#f11946" ref={loadingRef} />

      {/* Alert notifications */}
      <Alert
        message={alertMessage}
        type={alertType}
        duration={1000}
        onClose={() => {
          setAlertMessage("");
          setAlertType("");
        }}
      />

      {/* Main content */}
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <div className="card shadow-lg p-4">
          <h2 className="text-center mb-4">Task Details</h2>

          {/* Task details */}
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="form-control"
              value={task.title}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              className="form-control"
              value={task.description}
              rows="3"
              readOnly
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="dueDate" className="form-label">
                Due Date
              </label>
              <input
                type="datetime-local"
                id="dueDate"
                className="form-control"
                value={
                  task.dueDate
                    ? new Date(task.dueDate).toISOString().slice(0, 16)
                    : ""
                }
                readOnly
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="completed" className="form-label">
                Completed
              </label>
              <input
                type="text"
                id="completed"
                className="form-control"
                value={task.isCompleted ? "Yes" : "No"}
                readOnly
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="createdAt" className="form-label">
                Created At
              </label>
              <input
                type="datetime-local"
                id="createdAt"
                className="form-control"
                value={
                  task.createdAt
                    ? new Date(task.createdAt).toISOString().slice(0, 16)
                    : ""
                }
                readOnly
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="updatedAt" className="form-label">
                Updated At
              </label>
              <input
                type="datetime-local"
                id="updatedAt"
                className="form-control"
                value={
                  task.updatedAt
                    ? new Date(task.updatedAt).toISOString().slice(0, 16)
                    : ""
                }
                readOnly
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-primary" onClick={handleUpdateTask}>
              Update Task
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                setTaskId(task._id);
                setShowModal(true);
              }}
            >
              Delete Task
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this task?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  No
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDeleteTask}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleTask;
