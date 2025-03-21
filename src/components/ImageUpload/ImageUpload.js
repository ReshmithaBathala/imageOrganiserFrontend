import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import ImageGallery from "../ImageGallery/ImageGallery";
import "./ImageUpload.css";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [model, setModel] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("latest");

  // Load MobileNet model once
  //   useEffect(() => {
  //     const loadModel = async () => {
  //       const loadedModel = await mobilenet.load();
  //       setModel(loadedModel);
  //     };
  //     loadModel();
  //     fetchImages();
  //   }, []);

  //   useEffect(() => {
  //     const loadModel = async () => {
  //       const loadedModel = await mobilenet.load();
  //       setModel(loadedModel);
  //     };
  //     loadModel();
  //     fetchImages();
  //   }, [sortOrder]);
  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
    };
    loadModel();
  }, [sortOrder]);
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:5001/images");
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

        //   setSortedImages(sortedData);
        setUploadedImages(sortedData);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [sortOrder]); // This effect runs separately when sortOrder changes

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setImage(file);
  };

  const generateTags = async () => {
    if (!image || !model) return;

    const img = document.createElement("img");
    img.src = preview;
    img.onload = async () => {
      const predictions = await model.classify(img);
      setTags(predictions.map((p) => p.className));
    };
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("tags", JSON.stringify(tags));

    const response = await fetch("http://localhost:5001/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      //   alert("Image uploaded successfully!");
      setImage(null);
      setPreview(null);
      setTags([]);
      fetchImages();
    } else {
      alert("Upload failed.");
    }
  };

  //   const fetchImages = async () => {
  //     const response = await fetch("http://localhost:5001/images");
  //     if (response.ok) {
  //       const data = await response.json();
  //       setUploadedImages(data);
  //       if (sortOrder === "latest") {
  //         data.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)); // Descending order
  //       } else {
  //         data.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt)); // Ascending order
  //       }

  //       setUploadedImages(data);
  //       setLoading(false);
  //     }
  //   };
  //   const fetchImages = async () => {
  //     const response = await fetch("http://localhost:5001/images");
  //     if (response.ok) {
  //       let data = await response.json();
  //       data.sort((a, b) =>
  //         sortOrder === "latest"
  //           ? new Date(b.uploadedAt) - new Date(a.uploadedAt)
  //           : new Date(a.uploadedAt) - new Date(b.uploadedAt)
  //       );
  //       setUploadedImages(data);
  //       setLoading(false);
  //     }
  //     };
  //   const fetchImages = async () => {
  //     setLoading(true); // Ensure loading state is managed properly

  //     try {
  //       const response = await fetch("http://localhost:5001/images");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch images");
  //       }

  //       let data = await response.json();
  //       const sortedData =
  //         sortOrder === "latest"
  //           ? data.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
  //           : data.sort(
  //               (a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt)
  //             );

  //       setSortedImages(sortedData); // Update sortedImages state
  //     } catch (error) {
  //       console.error("Error fetching images:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  const fetchImages = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/images");
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      let data = await response.json();
      const sortedData =
        sortOrder === "latest"
          ? data.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
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
  return (
    <div className="upload-container">
      {/* <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="file-input"
      />
      {preview && <img src={preview} alt="Preview" className="preview-image" />}
      <button onClick={generateTags} disabled={!model} className="btn primary">
        Generate Tags
      </button>
      <button onClick={handleUpload} className="btn secondary">
        Upload
      </button> */}
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

        <button
          onClick={generateTags}
          disabled={!model}
          className="btn primary"
        >
          Generate Tags
        </button>

        <button onClick={handleUpload} className="btn secondary">
          Upload
        </button>
      </div>
      {preview && <img src={preview} alt="Preview" className="preview-image" />}

      <div className="tags-container">
        <h3>Tags:</h3>
        <p>{tags.length > 0 ? tags.join(", ") : "No tags generated"}</p>
      </div>
      <h3>Uploaded Images:</h3>
      <ImageGallery
        uploadedImages={uploadedImages}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </div>
  );
};

export default ImageUpload;
