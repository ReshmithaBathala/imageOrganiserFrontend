import React from "react";
import ImageUpload from "./components/ImageUpload/ImageUpload";
import "./App.css"; // Import CSS file for global styles

function App() {
  return (
    <div className="app-container">
      <h1 className="title">Image Organizer</h1>
      <ImageUpload />
    </div>
  );
}

export default App;
