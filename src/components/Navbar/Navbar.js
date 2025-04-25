// components/Navbar/Navbar.js
import React from "react";
import "./Navbar.css";

const Navbar = ({ activeView, setActiveView }) => {
  return (
    <div className="navbar">
      <button
        className={`nav-btn ${activeView === "photos" ? "active" : ""}`}
        onClick={() => setActiveView("photos")}
      >
        Photos
      </button>
      <button
        className={`nav-btn ${activeView === "albums" ? "active" : ""}`}
        onClick={() => setActiveView("albums")}
      >
        Albums
      </button>
    </div>
  );
};

export default Navbar;
