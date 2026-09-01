import React, { useState, useRef } from "react";
import { useVision } from "../hooks/useVision";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/axiosConfig";
import "./VisualSearch.css";

/**
 * VisualSearch Component
 * Handles image upload and visual search for products using Canvas API
 * Sends images to backend for TensorFlow.js based embedding analysis
 */
const VisualSearch = ({ onSearchResults, products = [] }) => {
  const { getAccessToken } = useAuth();
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const { extractImageFeatures, performVisualSearch, reset } = useVision(
    products,
    null,
    null,
    false,
  );

  /**
   * Handle file input change
   */
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  /**
   * Process selected image
   */
  const processImage = async (file) => {
    // Validate file
    if (!file.type.startsWith("image/")) {
      setSearchError("Please select a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setSearchError("Image size must be less than 10MB");
      return;
    }

    setSearchError(null);
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handle drag and drop
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  /**
   * Perform visual search
   */
  const handleSearch = async () => {
    if (!imageFile) {
      setSearchError("Please select an image first");
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      // Extract features locally
      const features = await extractImageFeatures(imageFile);
      console.log("Extracted features:", features);

      // Prepare form data for backend
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("top_k", 10);
      formData.append("similarity_threshold", 0.5);

      // Call backend API
      const token = getAccessToken();
      const response = await apiClient.post(
        "/ai/visual-search/search/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (onSearchResults) {
        onSearchResults(response.data.results);
      }
    } catch (error) {
      console.error("Visual search error:", error);
      setSearchError(
        error.response?.data?.detail ||
          error.message ||
          "Visual search failed. Please try again.",
      );
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Clear search
   */
  const handleClear = () => {
    setImagePreview(null);
    setImageFile(null);
    setSearchError(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Trigger file input
   */
  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="visual-search-container">
      <div className="visual-search-header">
        <h2>Visual Search</h2>
        <p>Upload an image to find similar products</p>
      </div>

      <div
        className={`visual-search-upload ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClickUpload}
      >
        {imagePreview ? (
          <div className="image-preview-wrapper">
            <img src={imagePreview} alt="Selected" className="image-preview" />
          </div>
        ) : (
          <div className="upload-placeholder">
            <svg
              className="upload-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="upload-text">Drag and drop your image here</p>
            <p className="upload-hint">or click to browse</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {searchError && <div className="search-error">{searchError}</div>}

      <div className="visual-search-actions">
        <button
          onClick={handleSearch}
          disabled={!imageFile || isSearching}
          className="search-button"
        >
          {isSearching ? (
            <>
              <span className="spinner-small"></span>
              Searching...
            </>
          ) : (
            "Search"
          )}
        </button>

        {imageFile && (
          <button
            onClick={handleClear}
            disabled={isSearching}
            className="clear-button"
          >
            Clear
          </button>
        )}
      </div>

      <div className="visual-search-info">
        <p>
          <strong>Supported formats:</strong> JPG, PNG, GIF, WebP
        </p>
        <p>
          <strong>Max file size:</strong> 10MB
        </p>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default VisualSearch;
