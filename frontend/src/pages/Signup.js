// Import necessary modules and components
import React, { useState, useContext } from "react";
import "./css/Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik"; // For form handling
import * as Yup from "yup"; // For validation
import Axios from "./Axios"; // HTTP request handler
import Alert from "../components/Alert"; // Custom alert component
import { AuthContext } from "../context/ContextApi"; // Authentication context

const Signup = () => {
  // States for alert management and button disable state
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [isDisabled, setIsDisabled] = useState(false);

  // Access loginUser function from AuthContext
  const { loginUser } = useContext(AuthContext);

  // Hook for navigation
  const navigate = useNavigate();

  // Form validation schema using Yup
  const schema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  // Formik configuration for form handling and submission
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // POST request to the server for user registration
        const result = await Axios.post("/registeruser", values, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Update alert with success message
        setAlert({ message: result.data.message, type: "success" });
        resetForm();
        setIsDisabled(true);

        // Redirect after 1.5 seconds and update context with user details
        setTimeout(() => {
          loginUser({
            id: result.data.data.id,
            username: result.data.data.username,
            email: result.data.data.email,
            token: result.data.token,
          });
          navigate("/");
        }, 1500);
      } catch (error) {
        // Handle errors and update alert with failure message
        const errorMessage =
          error.response?.data?.message || "Registration failed";
        setAlert({ message: errorMessage, type: "danger" });
      }
    },
  });

  return (
    <div className="container">
      {/* Alert message display */}
      <Alert
        duration={1500}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: "", type: "" })}
      />

      <form className="signup-form" onSubmit={formik.handleSubmit}>
        <h2 className="mb-3">Sign up</h2>

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
              autoComplete="off"
              placeholder="Enter your name"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-danger">{formik.errors.username}</div>
            )}
          </div>
        </div>

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
              autoComplete="off"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-danger">{formik.errors.email}</div>
            )}
          </div>
        </div>

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
              autoComplete="off"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-danger">{formik.errors.password}</div>
            )}
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
              Sign up
            </button>
          </div>
        </div>

        {/* Link to login page */}
        <div className="row mt-3 text-center">
          <div className="col-md-12">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-primary">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
