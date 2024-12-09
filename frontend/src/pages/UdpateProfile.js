import React, { useState, useContext, useEffect, useRef } from "react";
import "./css/UpdateProfile.css";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Axios from "./Axios";
import Alert from "../components/Alert";
import { AuthContext } from "../context/ContextApi";
import LoadingBar from "react-top-loading-bar";

const UpdateProfile = () => {
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(null); // Reference for loading bar
  const { loginUser, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  // Form validation schema
  const schema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  // Formik configuration for form handling
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: user.username,
      email: user.email,
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Include password if it's provided and valid
        if (password.length > 8 && typeof password === "string") {
          values.password = password;
        }

        // Send updated data to the server
        const result = await Axios.put(
          `/updateuser/${user.id}`,
          JSON.stringify(values),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setAlertMessage(result.data.message);
        setAlertType("success");
        resetForm();
        setIsDisabled(true);

        // Update user details in context and redirect to home
        setTimeout(() => {
          loginUser({
            token: user.token,
            id: result.data.data._id,
            username: result.data.data.username,
            email: result.data.data.email,
          });
          navigate("/"); // Navigate to home page
        }, 1500);
      } catch (error) {
        console.log(error);
        setAlertMessage(error.response.data.message);
        setAlertType("danger");
      }
    },
  });

  // Loading state update and user data initialization
  useEffect(() => {
    if (loadingRef.current) loadingRef.current.continuousStart();
    setLoading(true);
    setLoading(false);
    if (loadingRef.current) loadingRef.current.complete();
  }, [user]);

  // Render update profile form
  return (
    <div className="container">
      <LoadingBar color="#f11946" ref={loadingRef} />
      <Alert
        message={alertMessage}
        type={alertType}
        duration={1500}
        onClose={() => {
          setAlertMessage("");
          setAlertType("");
        }}
      />
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <form className="updateprofile-form" onSubmit={formik.handleSubmit}>
          <h2 className="mb-3">Update Profile</h2>

          {/* Username field */}
          <div className="row">
            <div className="col-md-2 col-lg-1 label-container">
              <label htmlFor="username" className="form-label">
                Name
              </label>
            </div>
            <div className="col-md-10 col-lg-11">
              <input
                type="text"
                name="username"
                id="username"
                className="form-control"
                placeholder="Enter your name"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
          {formik.touched.username && formik.errors.username && (
            <div className="text-danger">{formik.errors.username}</div>
          )}

          {/* Email field */}
          <div className="row mt-3">
            <div className="col-md-2 col-lg-1 label-container">
              <label htmlFor="email" className="form-label">
                Email
              </label>
            </div>
            <div className="col-md-10 col-lg-11">
              <input
                type="email"
                name="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
          {formik.touched.email && formik.errors.email && (
            <div className="text-danger">{formik.errors.email}</div>
          )}

          {/* Password field */}
          <div className="row mt-3">
            <div className="col-md-2 col-lg-1 label-container">
              <label htmlFor="password" className="form-label">
                Password
              </label>
            </div>
            <div className="col-md-10 col-lg-11">
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                placeholder="Enter new password (optional)"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="row mt-3">
            <div className="col-md-12">
              <button
                className="btn btn-primary w-100"
                disabled={isDisabled}
                type="submit"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateProfile;
