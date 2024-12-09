// Import necessary modules and components
import React, { useState, useContext, useRef, useEffect } from "react";
import "./css/Profile.css";
import { Link, useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar"; // Loading bar for visual feedback
import Axios from "../pages/Axios"; // HTTP request handler
import Alert from "../components/Alert"; // Custom alert component
import { AuthContext } from "../context/ContextApi"; // Authentication context

const Profile = () => {
  const navigate = useNavigate(); // For navigation
  const loadingRef = useRef(null); // Reference for the loading bar
  const [loading, setLoading] = useState(true); // State for loading state
  const [userDetail, setUserDetail] = useState(null); // State for storing user details
  const [alert, setAlert] = useState({ message: "", type: "" }); // Combined alert state
  const [showModal, setShowModal] = useState(false); // State for delete confirmation modal
  const { user, logoutUser, deleteUser } = useContext(AuthContext); // Accessing AuthContext functions

  // Effect to load user details and manage loading bar
  useEffect(() => {
    if (loadingRef.current) loadingRef.current.continuousStart(); // Start the loading bar
    setUserDetail(user); // Set user details from context
    setLoading(false);
    if (loadingRef.current) loadingRef.current.complete(); // Complete the loading bar
  }, [user]);

  // Handle delete account
  const deleteAccount = () => setShowModal(true);

  // Confirm and delete account
  const confirmDeleteAccount = async () => {
    try {
      const result = await Axios.delete(`/deleteuser/${user.id}`);
      setAlert({ message: result.data.message, type: "success" }); // Success alert
      deleteUser(); // Clear user data in context
      setShowModal(false); // Close modal
      setTimeout(() => navigate("/"), 1500); // Redirect to home after delay
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete account";
      setAlert({ message: errorMessage, type: "danger" }); // Failure alert
      setShowModal(false); // Close modal
    }
  };

  return (
    <>
      <LoadingBar color="#f11946" ref={loadingRef} />
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <div className="container mt-5">
          {/* Alert message display */}
          <Alert
            message={alert.message}
            type={alert.type}
            duration={1500}
            onClose={() => setAlert({ message: "", type: "" })}
          />

          {/* Delete Account Modal */}
          {showModal && (
            <div className="modal fade show" style={{ display: "block" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Delete Account</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
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
                      onClick={() => setShowModal(false)}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={confirmDeleteAccount}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Information */}
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">Profile Information</h2>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={userDetail.username || "JohnDoe"} // Dynamic username fallback
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={userDetail.email || "example@example.com"} // Dynamic email fallback
                readOnly
              />
            </div>
            <div className="d-flex justify-content-between mt-4">
              <Link
                className="btn btn-primary responsive-btn"
                to="/updateprofile"
              >
                Update Profile
              </Link>
              <button
                className="btn btn-danger responsive-btn"
                onClick={deleteAccount}
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
