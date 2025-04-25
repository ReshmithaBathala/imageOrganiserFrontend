import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import ImageGallery from "../ImageGallery/ImageGallery";
import Navbar from "../Navbar/Navbar";
import "./ImageUpload.css";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [model, setModel] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("latest");
  const [activeView, setActiveView] = useState("photos"); // 'photos' or 'albums'

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://imageorganiserbackend-4.onrender.com/images"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        let data = await response.json();
        const sortedData =
          sortOrder === "latest"
            ? data.sort(
                (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
              )
            : data.sort(
                (a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt)
              );
        setUploadedImages(sortedData);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [sortOrder]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setPreview(reader.result);
      // Automatically generate tags when image is loaded
      if (model) {
        const img = document.createElement("img");
        img.src = reader.result;
        img.onload = async () => {
          const predictions = await model.classify(img);
          setTags(predictions.map((p) => p.className));
        };
      }
    };
    reader.readAsDataURL(file);
    setImage(file);
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("tags", JSON.stringify(tags));

    const response = await fetch(
      "https://imageorganiserbackend-4.onrender.com/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      setImage(null);
      setPreview(null);
      setTags([]);
      // Refresh the view based on current active view
      if (activeView === "photos") {
        const fetchResponse = await fetch(
          "https://imageorganiserbackend-4.onrender.com/images"
        );
        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          const sortedData =
            sortOrder === "latest"
              ? data.sort(
                  (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
                )
              : data.sort(
                  (a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt)
                );
          setUploadedImages(sortedData);
        }
      }
    } else {
      alert("Upload failed.");
    }
  };

  return (
    <div className="upload-container">
      <div className="ip">
        <label htmlFor="file-upload" className="custom-file-label">
          Choose Image
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input"
        />

        {/* <button
          onClick={generateTags}
          disabled={!model}
          className="btn primary"
        >
          Generate Tags
        </button> */}

        <button onClick={handleUpload} className="btn secondary">
          Upload
        </button>
      </div>
      {preview && <img src={preview} alt="Preview" className="preview-image" />}

      <div className="tags-container">
        <h3>Tags:</h3>
        <p>{tags.length > 0 ? tags.join(", ") : "No tags generated"}</p>
      </div>

      <Navbar activeView={activeView} setActiveView={setActiveView} />

      <ImageGallery
        uploadedImages={uploadedImages}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        activeView={activeView}
      />
    </div>
  );
};

export default ImageUpload;
