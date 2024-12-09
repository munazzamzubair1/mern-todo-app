// Import necessary modules
import React from "react";
import { useNavigate } from "react-router-dom";
const NoPage = () => {
  // Redirect to home page after 4 seconds
  const navigate = useNavigate();
  setTimeout(() => {
    navigate("/");
  }, 4000);
  return (
    <div className="container">
      <h1 className="mt-3">404</h1>
      <p className="fs-4">
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
};

export default NoPage;
