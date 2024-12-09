import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "./Axios";
import { AuthContext } from "../context/ContextApi";
import LoadingBar from "react-top-loading-bar";
import Alert from "../components/Alert";
import "./css/Tasks.css";

const Tasks = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [showModal, setShowModal] = useState(false);
  const [taskId, setTaskId] = useState(""); // Task ID for deletion
  const { user } = useContext(AuthContext); // Get user details from context
  const loadingRef = useRef(null);
  const navigate = useNavigate();

  // Fetch all tasks for the user
  const fetchAllTasks = async () => {
    try {
      if (loadingRef.current) loadingRef.current.continuousStart();
      const { data } = await Axios.get(`/readtasksbyuid/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Use token for authorization
        },
      });
      setTasks(data.data || []); // Set tasks or empty array if none
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      if (loadingRef.current) loadingRef.current.complete();
      setLoading(false); // End loading state
    }
  };

  // Fetch tasks when user changes or is logged in
  useEffect(() => {
    if (user?.id) fetchAllTasks();
  }, [user]);

  // Handle task navigation (e.g., view details, update task)
  const handleTaskNavigation = (path, id) => {
    navigate(path, { state: { task_id: id } });
  };

  // Handle task deletion
  const deleteTask = async () => {
    try {
      const { data } = await Axios.delete(`/deletetaskbyid/${taskId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setAlert({ message: data.message, type: "success" });
      setShowModal(false); // Close confirmation modal
      fetchAllTasks(); // Refresh task list
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || "Error deleting task",
        type: "danger",
      });
    }
  };

  // Close modal
  const closeModal = () => setShowModal(false);

  // Render task rows in the table
  const renderTaskRows = () =>
    tasks.length > 0 ? (
      tasks.map(
        ({
          _id,
          title,
          description,
          dueDate,
          createdAt,
          updatedAt,
          isCompleted,
        }) => (
          <tr key={_id}>
            <td>{title}</td>
            <td>{description}</td>
            <td>{dueDate ? new Date(dueDate).toLocaleString() : "N/A"}</td>
            <td>{createdAt ? new Date(createdAt).toLocaleString() : "N/A"}</td>
            <td>{updatedAt ? new Date(updatedAt).toLocaleString() : "N/A"}</td>
            <td>{isCompleted ? "Yes" : "No"}</td>
            <td>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleTaskNavigation("/singletask", _id)}
              >
                Details
              </button>
            </td>
            <td>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleTaskNavigation("/updatetask", _id)}
              >
                Update
              </button>
            </td>
            <td>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setTaskId(_id); // Set task ID for deletion
                  setShowModal(true); // Show modal for confirmation
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        )
      )
    ) : (
      <tr>
        <td colSpan="9">No tasks found.</td>
      </tr>
    );

  return (
    <div className="container">
      <LoadingBar color="#f11946" ref={loadingRef} />
      <Alert
        message={alert.message}
        type={alert.type}
        duration={2000}
        onClose={() => setAlert({ message: "", type: "" })}
      />
      {user?.username ? (
        <>
          <Link className="btn btn-outline-primary btn-sm mb-3" to="/addtask">
            Add Task
          </Link>
          {loading ? (
            <h2>Loading...</h2>
          ) : (
            <table className="table table-bordered table-responsive mt-3">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Completed</th>
                  <th>Detail</th>
                  <th>Update</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>{renderTaskRows()}</tbody>
            </table>
          )}
        </>
      ) : (
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-md-6 text-center">
            <div className="p-4 shadow rounded bg-light">
              <h2>Login to access your tasks.</h2>
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="text-success fw-bold">
                  Sign up
                </Link>
              </p>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this task?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  No
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={deleteTask}
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

export default Tasks;
