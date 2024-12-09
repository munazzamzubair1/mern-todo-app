import React, { useState, useContext } from "react";
import "./css/AddTask.css";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik"; // For handling forms easily
import * as Yup from "yup"; // For form validation
import Axios from "./Axios"; // For making HTTP requests
import Alert from "../components/Alert"; // For alert messages
import { AuthContext } from "../context/ContextApi"; // To get user context

const AddTask = () => {
  // State for handling alert messages and form submission status
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [isDisabled, setIsDisabled] = useState(false); // Disable submit button after form submission
  const { user } = useContext(AuthContext); // Get current user from context
  const navigate = useNavigate(); // For navigation after successful submission

  // Validation schema for the task form using Yup
  const schema = Yup.object({
    title: Yup.string()
      .min(10, "Title should be at least 10 characters")
      .required("Title is required"), // Title must be at least 10 characters long
    description: Yup.string()
      .min(10, "Description should be at least 10 characters")
      .required("Description is required"), // Description must be at least 10 characters long
    isCompleted: Yup.boolean().required("Completed is required"), // Completion status is required
    dueDate: Yup.date().required("Due date is required"), // Due date is required
  });

  // Formik hook for managing form state and handling form submission
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      isCompleted: false,
      dueDate: "",
    },
    validationSchema: schema, // Apply validation schema
    onSubmit: async (values, { resetForm }) => {
      try {
        // Attach userId to the form data
        values.userId = user.id;

        // Make the POST request to create a task
        const result = await Axios.post("/createtask", JSON.stringify(values), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        // Show success message and disable the submit button
        setAlertMessage(result.data.message);
        setAlertType("success");
        resetForm(); // Reset the form after successful submission
        setIsDisabled(true);

        // Redirect to tasks page after 1.5 seconds
        setTimeout(() => {
          navigate("/tasks");
        }, 1500);
      } catch (error) {
        console.log(error);
        // Show error message if something goes wrong
        setAlertMessage(
          error.response?.data || "Error occurred while creating task"
        );
        setAlertType("danger");
      }
    },
  });

  return (
    <div className="container">
      {/* Display alert messages */}
      <Alert
        message={alertMessage}
        type={alertType}
        duration={1000}
        onClose={() => {
          setAlertMessage("");
          setAlertType("");
        }}
      />
      {/* Form to add a task */}
      <form className="addtask-form mb-5" onSubmit={formik.handleSubmit}>
        <h2 className="mb-3">Add Task</h2>

        {/* Title Input */}
        <div className="row">
          <div className="col-xl-1 col-md-2 label-container">
            <label htmlFor="title" className="form-label">
              Title
            </label>
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
              <p className="text-danger">{formik.errors.title}</p>
            )}
          </div>
        </div>

        {/* Description Input */}
        <div className="row mt-3">
          <div className="col-xl-1 col-md-2 label-container">
            <label htmlFor="description" className="form-label">
              Description
            </label>
          </div>
          <div className="col-xl-11 col-md-10">
            <textarea
              name="description"
              className="form-control"
              placeholder="Enter task description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <p className="text-danger">{formik.errors.description}</p>
            )}
          </div>
        </div>

        {/* Completed Dropdown */}
        <div className="row mt-3">
          <div className="col-xl-1 col-md-2 label-container">
            <label htmlFor="isCompleted" className="form-label">
              Completed
            </label>
          </div>
          <div className="col-xl-11 col-md-10">
            <select
              name="isCompleted"
              className="form-control"
              value={formik.values.isCompleted}
              onChange={(e) =>
                formik.setFieldValue("isCompleted", e.target.value === "true")
              }
              onBlur={formik.handleBlur}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {formik.touched.isCompleted && formik.errors.isCompleted && (
              <p className="text-danger">{formik.errors.isCompleted}</p>
            )}
          </div>
        </div>

        {/* Due Date Input */}
        <div className="row mt-3">
          <div className="col-xl-1 col-md-2 label-container">
            <label htmlFor="dueDate" className="form-label">
              Due Date
            </label>
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
              <p className="text-danger">{formik.errors.dueDate}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="row mt-3">
          <div className="col-md-12">
            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={isDisabled}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
