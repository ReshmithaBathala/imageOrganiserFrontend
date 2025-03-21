import React, { useState, useEffect } from "react";
import "./ImageGallery.css";
const ImageGallery = ({ uploadedImages, sortOrder, setSortOrder }) => {
  //   const [uploadedImages, setUploadedImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const sorted = [...uploadedImages].sort((a, b) => {
      return sortOrder === "latest"
        ? new Date(b.uploadedAt) - new Date(a.uploadedAt)
        : new Date(a.uploadedAt) - new Date(b.uploadedAt);
    });
    // setSortedImages(sorted);
  }, [uploadedImages, sortOrder]);

  const filteredImages = uploadedImages.filter((img) => {
    let tags = [];
    try {
      tags = JSON.parse(img.tags || "[]");
    } catch (error) {
      console.error("Error parsing tags:", error);
    }
    return tags.some((tag) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const sortedImages = [...filteredImages].sort((a, b) => {
    return sortOrder === "latest"
      ? new Date(b.uploadedAt) - new Date(a.uploadedAt)
      : new Date(a.uploadedAt) - new Date(b.uploadedAt);
  });

  return (
    // <div>
    //   <input
    //     type="text"
    //     placeholder="Search by tags..."
    //     value={searchTerm}
    //     onChange={(e) => setSearchTerm(e.target.value)}
    //   />
    //   <div style={{ display: "flex", flexWrap: "wrap" }}>
    //     {filteredImages.map((img) => {
    //       let tags = [];
    //       try {
    //         tags = JSON.parse(img.tags);
    //       } catch (error) {
    //         console.error("Error parsing tags:", error);
    //       }

    //       return (
    //         <div key={img.id} style={{ margin: "10px", textAlign: "center" }}>
    //           <img
    //             src={`http://localhost:5001/${img.path}`}
    //             alt={img.filename}
    //             width="150"
    //           />
    //           {/* <p>{tags.length > 0 ? tags.join(", ") : "No tags available"}</p> */}
    //         </div>
    //       );
    //     })}
    //   </div>
    // </div>
    <div className="gallery-container">
      <div className="top-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="sort-container">
          <label htmlFor="sort">Sort By:</label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-dropdown"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
      <div className="gallery-grid">
        {/* {filteredImages.map((img) => {
          let tags = [];
          try {
            tags = JSON.parse(img.tags);
          } catch (error) {
            console.error("Error parsing tags:", error);
          } */}
        {sortedImages.map((img) => {
          let tags = [];
          try {
            tags = JSON.parse(img.tags);
          } catch (error) {
            console.error("Error parsing tags:", error);
          }

          return (
            <div key={img.id} className="gallery-item">
              <img
                src={`http://localhost:5001/${img.path}`}
                alt={img.filename}
                className="gallery-image"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageGallery;
