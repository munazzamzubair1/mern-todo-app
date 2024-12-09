import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./css/Navbar.css";
import Axios from "../pages/Axios"; // Axios for API requests
import Alert from "./Alert"; // Alert component for displaying messages
import { AuthContext } from "../context/ContextApi"; // AuthContext for user authentication

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for displaying alert messages
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showModel, setShowModel] = useState(false); // State for managing modal visibility
  const { user, logoutUser, deleteUser } = useContext(AuthContext); // Access user and auth functions from context
  const [title, setTitle] = useState(null); // State for dynamic page title

  // Set dynamic page title based on current path
  useEffect(() => {
    switch (location.pathname) {
      case "/":
      case "/home":
        setTitle("Home");
        break;
      case "/tasks":
        setTitle("Tasks");
        break;
      case "/addtask":
        setTitle("Add Task");
        break;
      case "/updatetask":
        setTitle("Update Task");
        break;
      case "/profile":
        setTitle("Profile");
        break;
      case "/updateprofile":
        setTitle("Update Profile");
        break;
      case "/login":
        setTitle("Login");
        break;
      case "/signup":
        setTitle("Signup");
        break;
      default:
        setTitle("MERN Todo App");
    }
  }, [location.pathname]);

  // Update document title on title state change
  useEffect(() => {
    document.title = `${title} Page`;
  }, [title]);

  // Handle logout
  const logout = () => {
    setTimeout(() => {
      logoutUser(); // Clear user data from context and cookies
      navigate("/"); // Redirect to home page
    }, 1500);
  };

  // Display modal for account deletion confirmation
  const deleteAccount = () => setShowModel(true);

  // Confirm account deletion
  const confirmDeleteAccount = async () => {
    try {
      const result = await Axios.delete(`/deleteuser/${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }, // Include token for authorization
      });
      setAlertMessage(result.data.message); // Show success message
      setAlertType("success");
      setShowModel(false); // Hide modal after deletion
      setTimeout(() => {
        deleteUser(); // Clear user data from context and cookies
        navigate("/"); // Redirect to home page
      }, 1500);
    } catch (error) {
      console.log(error);
      setAlertMessage(error.response.data.message); // Show error message
      setAlertType("danger");
      setShowModel(false); // Close modal on error
    }
  };

  return (
    <>
      {/* Modal for confirming account deletion */}
      <div
        className={`modal fade ${showModel ? "show" : ""}`}
        style={{ display: showModel ? "block" : "none" }}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Account</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModel(false)} // Close modal on "No"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete your account?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModel(false)} // Close modal
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDeleteAccount} // Confirm deletion
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div
        style={{ position: "sticky", top: 0, zIndex: "1050" }}
        className="main-div"
      >
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container">
            <Link className="navbar-brand" to="/">
              todo
            </Link>{" "}
            {/* Navbar brand */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              {/* Navbar links */}
              <ul className="navbar-nav navbar-links me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" to="/home">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/tasks">
                    Tasks
                  </Link>
                </li>
                {user.username ? (
                  <>
                    {/* Profile dropdown for logged-in users */}
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link dropdown-toggle"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Profile
                      </Link>
                      <ul className="dropdown-menu">
                        <li>
                          <Link className="dropdown-item" to="/profile">
                            Profile Information
                          </Link>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={deleteAccount}
                          >
                            Delete Account
                          </button>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to="#"
                            onClick={logout}
                          >
                            Logout
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </>
                ) : (
                  <>
                    {/* Links for non-logged-in users */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">
                        Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/signup">
                        Sign up
                      </Link>
                    </li>
                  </>
                )}
              </ul>

              {/* Search bar */}
              <form className="d-flex" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button className="btn btn-outline-success" type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
        </nav>

        {/* Display username */}
        <div
          className="username"
          style={{
            color: "crimson",
            fontFamily: "sans-serif",
            position: "absolute",
            right: "85px",
            fontWeight: "bold",
            fontSize: "1.25rem",
          }}
        >
          Hello{" "}
          {user.username
            ? `${user.username.charAt(0).toUpperCase()}${user.username.slice(
                1
              )}`
            : "Guest"}
        </div>
      </div>

      {/* Alert component */}
      <div className="container mt-3">
        <Alert
          message={alertMessage}
          type={alertType}
          duration={1500}
          onClose={() => {
            setAlertMessage(""); // Reset alert message after duration
            setAlertType(""); // Reset alert type
          }}
        />
      </div>
    </>
  );
};

export default Navbar;
