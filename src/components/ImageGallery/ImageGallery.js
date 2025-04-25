// components/ImageGallery/ImageGallery.js
import React, { useState, useEffect } from "react";
import "./ImageGallery.css";

const ImageGallery = ({
  uploadedImages,
  sortOrder,
  setSortOrder,
  activeView,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [loadingAlbums, setLoadingAlbums] = useState(false);

  useEffect(() => {
    if (activeView === "albums" && !selectedAlbum) {
      fetchAlbums();
    }
  }, [activeView, selectedAlbum]);

  const fetchAlbums = async () => {
    setLoadingAlbums(true);
    try {
      const response = await fetch(
        "https://imageorganiserbackend-4.onrender.com/albums"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch albums");
      }
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error("Error fetching albums:", error);
    } finally {
      setLoadingAlbums(false);
    }
  };

  const handleAlbumClick = async (tag) => {
    try {
      const response = await fetch(
        `https://imageorganiserbackend-4.onrender.com/albums/${tag}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch album images");
      }
      const data = await response.json();
      setSelectedAlbum({
        tag,
        images: data,
      });
    } catch (error) {
      console.error("Error fetching album images:", error);
    }
  };

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

  if (activeView === "albums") {
    if (selectedAlbum) {
      return (
        <div className="gallery-container">
          <button
            className="back-button"
            onClick={() => setSelectedAlbum(null)}
          >
            ← Back to Albums
          </button>
          <h2 className="album-title">Album: {selectedAlbum.tag}</h2>
          <div className="gallery-grid">
            {selectedAlbum.images.map((img) => (
              <div key={img.id} className="gallery-item">
                <img
                  src={`https://imageorganiserbackend-4.onrender.com/${img.path}`}
                  alt={img.filename}
                  className="gallery-image"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="gallery-container">
        <div className="top-bar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search albums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loadingAlbums ? (
          <p>Loading albums...</p>
        ) : (
          <div className="albums-grid">
            {albums
              .filter((album) =>
                album.tag.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((album) => (
                <div
                  key={album.tag}
                  className="album-card"
                  onClick={() => handleAlbumClick(album.tag)}
                >
                  <img
                    src={`https://imageorganiserbackend-4.onrender.com/${album.coverImage.path}`}
                    alt={album.coverImage.filename}
                    className="album-cover"
                  />
                  <div className="album-info">
                    <h3>{album.tag}</h3>
                    <p>{album.images.length} photos</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }

  // Default photos view
  return (
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
        {/* <div className="sort-container">
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
        </div> */}
      </div>
      <div className="gallery-grid">
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
                src={`https://imageorganiserbackend-4.onrender.com/${img.path}`}
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
