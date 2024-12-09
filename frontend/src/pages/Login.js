// Import necessary modules
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik"; // For form handling
import * as Yup from "yup"; // For form validation
import Axios from "./Axios"; // Custom Axios instance for HTTP requests
import Alert from "../components/Alert"; // Alert component for user feedback
import { AuthContext } from "../context/ContextApi"; // Context for authentication state
import "./css/Login.css";

// Login Component
const Login = () => {
  // States for alert messages and button disable functionality
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  // Authentication context to manage user state globally
  const { loginUser } = useContext(AuthContext);

  // React Router navigation hook
  const navigate = useNavigate();

  // Form validation schema using Yup
  const schema = Yup.object({
    email: Yup.string()
      .email("Invalid email format") // Validates email format
      .required("Email is required"), // Ensures email is not empty
    password: Yup.string()
      .min(8, "Password must be at least 8 characters") // Minimum length validation
      .required("Password is required"), // Ensures password is not empty
  });

  // Formik configuration for form handling
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Send login request to the server
        const result = await Axios.post("/loginuser", JSON.stringify(values), {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Handle successful login
        setAlertMessage(result.data.message);
        setAlertType("success");
        setIsDisabled(true);

        // Set user details in context and navigate to tasks page after a delay
        setTimeout(() => {
          loginUser({
            id: result.data.data.id,
            username: result.data.data.username,
            email: result.data.data.email,
            token: result.data.token,
          });
          navigate("/tasks");
        }, 1500);

        // Reset the form fields
        resetForm();
      } catch (error) {
        // Handle error response
        setAlertMessage(error.response?.data?.message || "Login failed");
        setAlertType("danger");
      }
    },
  });

  // Render the Login component
  return (
    <div className="container">
      {/* Alert for feedback */}
      <Alert
        duration={1500}
        message={alertMessage}
        type={alertType}
        onClose={() => {
          setAlertMessage("");
          setAlertType("");
        }}
      />

      {/* Login Form */}
      <form className="login-form" onSubmit={formik.handleSubmit}>
        <h2 className="mb-3">Login Form</h2>

        {/* Email Field */}
        <div className="row">
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
              autoComplete="off"
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

        {/* Password Field */}
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
              autoComplete="off"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>
        {formik.touched.password && formik.errors.password && (
          <div className="text-danger">{formik.errors.password}</div>
        )}

        {/* Submit Button */}
        <div className="row mt-3">
          <div className="col-md-12">
            <button
              className="btn btn-primary w-100"
              disabled={isDisabled}
              type="submit"
            >
              Login
            </button>
          </div>
        </div>

        {/* Signup Redirect */}
        <div className="row mt-3">
          <div className="col-md-12">
            <p>
              Don't have an account? <Link to="/signup">Signup</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
