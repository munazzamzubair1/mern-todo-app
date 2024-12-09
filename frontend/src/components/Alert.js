// Import necessary modules from React
import React, { useEffect } from "react";

// Alert Component: Displays an alert message that auto-closes after a given duration
const Alert = ({ message, type, duration, onClose }) => {
  // useEffect hook to automatically close the alert after the specified duration
  useEffect(() => {
    if (duration) {
      // Set a timeout to close the alert after the specified duration
      const timer = setTimeout(() => {
        onClose(); // Trigger onClose callback to hide the alert
      }, duration);

      // Cleanup the timer on component unmount or when duration changes
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]); // Dependency array ensures effect runs only when duration or onClose changes

  // If no message is provided, return null (don't render anything)
  if (!message) return null;

  return (
    <div className={`alert alert-${type} alert-dismissible fade show mt-3`}>
      {message} {/* Display the alert message */}
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={onClose} // Close alert manually when button is clicked
      ></button>
    </div>
  );
};

export default Alert;
