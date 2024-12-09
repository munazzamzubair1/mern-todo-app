import React from "react";

const Footer = () => {
  // Footer component
  return (
    <div
      className="bg-light py-3"
      style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}
    >
      {/* Footer content */}
      <p className="text-center m-0">
        Copyright &copy; 2024 My To-Do App All rights reserved
      </p>
    </div>
  );
};

export default Footer;
