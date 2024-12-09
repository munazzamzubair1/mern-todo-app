// Import necessary modules
import React, { useState, useRef, useEffect, useContext } from "react";
import "./css/UpdateTask.css";
import { useNavigate, useLocation } from "react-router-dom"; // Import hooks from react-router-dom
import Axios from "./Axios"; // Axios for HTTP requests
import { AuthContext } from "../context/ContextApi"; // Import AuthContext for user authentication
import LoadingBar from "react-top-loading-bar"; // Loading bar for better user experience
import { useFormik } from "formik"; // Formik for form handling
import * as Yup from "yup"; // Yup for validation
import Alert from "../components/Alert"; // Alert component for displaying messages

const UpdateTask = () => {
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [task, setTask] = useState({
    title: "",
    description: "",
    isCompleted: false,
    dueDate: "",
  }); // State to store task details
  const location = useLocation(); // Get the location object to access task_id
  const { task_id } = location.state; // Extract task_id from location state
  const loadingRef = useRef(null); // Ref for loading bar
  const [alertMessage, setAlertMessage] = useState(""); // State for alert message
  const [alertType, setAlertType] = useState(""); // State for alert type
  const [isDisabled, setIsDisabled] = useState(false); // Disable submit button after successful submission
  const { user } = useContext(AuthContext); // Get user data from context
  const navigate = useNavigate(); // Navigate hook for redirection

  // Fetch task details from the server
  const fetchTask = async () => {
    try {
      setLoading(true);
      if (loadingRef.current) loadingRef.current.continuousStart(); // Start loading bar
      const result = await Axios.get(`/readtaskbyid/${task_id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTask(result.data.data); // Set fetched task details
    } catch (error) {
      console.error(error); // Log error if any
    } finally {
      if (loadingRef.current) loadingRef.current.complete(); // Stop loading bar
      setLoading(false);
    }
  };

  // Fetch task when task_id changes
  useEffect(() => {
    fetchTask();
  }, [task_id]);

  // Validation schema using Yup
  const schema = Yup.object({
    title: Yup.string().min(10).required("Title is required"),
    description: Yup.string().min(10).required("Description is required"),
    isCompleted: Yup.boolean()
      .transform((value) => value === "true")
      .required("Completed is required"),
    dueDate: Yup.date()
      .typeError("Invalid date format")
      .required("Due date is required"),
  });

  // Formik hook for form handling
  const formik = useFormik({
    enableReinitialize: true, // Reinitialize values when task is fetched
    initialValues: {
      userId: user.id,
      title: task.title,
      description: task.description,
      isCompleted: task.isCompleted,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 16)
        : "", // Provide a fallback for invalid or undefined dates
    },
    validationSchema: schema, // Apply validation schema
    onSubmit: async (values, { resetForm }) => {
      values.updatedAt = Date.now(); // Add updated timestamp
      try {
        const result = await Axios.put(
          `/updatetaskbyid/${task_id}`,
          JSON.stringify(values),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setAlertMessage(result.data.message); // Set success message
        setAlertType("success");
        resetForm(); // Reset form after submission
        setIsDisabled(true); // Disable submit button
        setTimeout(() => navigate("/tasks"), 1500); // Redirect after delay
      } catch (error) {
        console.error(error);
        setAlertMessage(error.response.data); // Set error message
        setAlertType("danger");
      }
    },
  });

  // Render UpdateTask component
  return (
    <div className="container">
      <LoadingBar color="#f11946" ref={loadingRef} />{" "}
      {/* Display loading bar */}
      <Alert
        message={alertMessage}
        type={alertType}
        duration={1000}
        onClose={() => {
          setAlertMessage("");
          setAlertType("");
        }} // Close alert
      />
      {loading ? (
        <h2>Loading...</h2> // Show loading message while fetching task
      ) : (
        <form className="updatetask-form mb-5" onSubmit={formik.handleSubmit}>
          <h2 className="mb-3">Update Task</h2>
          {/* Title input */}
          <div className="row">
            <div className="col-xl-1 col-md-2 label-container">
              <label className="form-label">Title</label>
            </div>
            <div className="col-xl-11 col-md-10">
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Enter task title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-danger">{formik.errors.title}</p> // Display error message for title
              )}
            </div>
          </div>

          {/* Description input */}
          <div className="row mt-3">
            <div className="col-xl-1 col-md-2 label-container">
              <label className="form-label">Description</label>
            </div>
            <div className="col-xl-11 col-md-10">
              <textarea
                name="description"
                className="form-control"
                placeholder="Enter title description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-danger">{formik.errors.description}</p> // Display error message for description
              )}
            </div>
          </div>

          {/* Completed status select */}
          <div className="row mt-3">
            <div className="col-xl-1 col-md-2 label-container">
              <label className="form-label">Completed</label>
            </div>
            <div className="col-xl-11 col-md-10">
              <select
                name="isCompleted"
                className="form-control"
                value={formik.values.isCompleted}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              {formik.touched.isCompleted && formik.errors.isCompleted && (
                <p className="text-danger">{formik.errors.isCompleted}</p> // Display error message for completed
              )}
            </div>
          </div>

          {/* Due Date input */}
          <div className="row mt-3">
            <div className="col-xl-1 col-md-2 label-container">
              <label className="form-label">Due Date</label>
            </div>
            <div className="col-xl-11 col-md-10">
              <input
                type="datetime-local"
                name="dueDate"
                className="form-control"
                value={formik.values.dueDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.dueDate && formik.errors.dueDate && (
                <p className="text-danger">{formik.errors.dueDate}</p> // Display error message for due date
              )}
            </div>
          </div>

          {/* Submit button */}
          <div className="row mt-3">
            <div className="col-md-12">
              <button
                className="btn btn-primary w-100"
                type="submit"
                disabled={isDisabled} // Disable after successful submission
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateTask;
