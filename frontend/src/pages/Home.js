import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Home.css";
import Axios from "./Axios"; // Axios for HTTP requests
import { AuthContext } from "../context/ContextApi"; // Context for user authentication
import LoadingBar from "react-top-loading-bar"; // Loading bar component
import Alert from "../components/Alert"; // Alert component to display messages

const Home = () => {
  const [loading, setLoading] = useState(true); // State to track loading status
  const [tasks, setTasks] = useState([]); // State to store tasks
  const { user } = useContext(AuthContext); // Get user from context
  const loadingRef = useRef(null); // Reference for the loading bar
  const [alertMessage, setAlertMessage] = useState(""); // State for alert message
  const [alertType, setAlertType] = useState(""); // State for alert type
  const navigate = useNavigate(); // Navigate for routing

  // Fetch all tasks from the server
  const fetchAllTasks = async () => {
    try {
      if (loadingRef.current) loadingRef.current.continuousStart(); // Start loading bar
      setLoading(true);

      // Send GET request to fetch tasks for the authenticated user
      const result = await Axios.get(`/readtasksbyuid/${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }, // Authorization header with token
      });

      setTasks(result.data.data); // Set tasks from response
    } catch (error) {
      console.error(error); // Log any errors
    } finally {
      if (loadingRef.current) loadingRef.current.complete(); // Complete loading bar
      setLoading(false); // Stop loading state
    }
  };

  // Fetch tasks when the component mounts or user changes
  useEffect(() => {
    if (user && user.id) fetchAllTasks();
  }, [user]);

  // Handle task detail view navigation
  const detailTask = (id) => {
    navigate("/singletask", { state: { task_id: id } });
  };

  // Render Home component
  return (
    <div className="container">
      <LoadingBar color="#f11946" ref={loadingRef} /> {/* Loading bar */}
      <Alert
        message={alertMessage}
        type={alertType}
        duration={1000}
        onClose={() => {
          setAlertMessage(""); // Clear alert message
          setAlertType(""); // Clear alert type
        }}
      />
      {/* Check if user is authenticated */}
      {user.username ? (
        <>
          {loading ? (
            <h2>Loading...</h2> // Show loading message
          ) : (
            <>
              <div className="row">
                <div className="col-md-12">
                  <h2 className="app-title mt-2">Todo App</h2>
                  <p className="app-desc">
                    Welcome to My To-Do App. Easily manage your tasks and stay
                    organized.
                  </p>
                </div>
              </div>

              {/* Render tasks or show message if no tasks found */}
              <div className="row">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div className="col-lg-4 col-md-6 mb-4" key={task._id}>
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">{task.title}</h5>
                          <p className="card-text">{task.description}</p>
                          <p>
                            Created At{" "}
                            <span className="badge bg-primary">
                              {task.createdAt
                                ? new Date(task.createdAt).toLocaleString()
                                : "N/A"}
                            </span>
                            <br />
                            Updated At{" "}
                            <span className="badge bg-success">
                              {task.updatedAt
                                ? new Date(task.updatedAt).toLocaleString()
                                : "N/A"}
                            </span>
                          </p>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={(e) => {
                              e.preventDefault();
                              detailTask(task._id); // Navigate to task details page
                            }}
                          >
                            View details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">No tasks found</h5>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        // If user is not authenticated, show login/signup options
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-sm-10 col-md-8 col-lg-6 text-center">
            <div className="p-4 shadow rounded bg-light">
              <h2 className="mb-4">Login to access your tasks</h2>
              <p className="mb-3">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-success fw-bold text-decoration-none"
                >
                  Sign up
                </Link>
              </p>
              <Link to="/login" className="btn btn-primary px-4">
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
