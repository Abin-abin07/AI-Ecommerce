import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Camera, Loader2, Image as ImageIcon } from 'lucide-react';
import { classifyImage, extractSearchTerms, loadModel } from '../services/aiImageSearch';
import './ImageSearchModal.css';

const ImageSearchModal = ({ isOpen, onClose, onSearch, onStartAnalysis }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Pre-load AI models in the background while user is picking a file to save time later
      loadModel().catch(e => console.log("Pre-load model error:", e));
    } else {
      // Reset state when closed
      setSelectedImage(null);
      setPredictions([]);
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async () => {
    if (!imageRef.current) return;
    
    setIsProcessing(true);
    setPredictions([]);
    if (onStartAnalysis) onStartAnalysis();
    
    try {
      const results = await classifyImage(imageRef.current);
      setPredictions(results);
      
      const terms = extractSearchTerms(results);
      
      setTimeout(() => {
        onSearch(terms);
        onClose();
      }, 400); // Reduced delay to boost visual search speed
      
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>AI Image Search</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        
        <div className="modal-body">
          {!selectedImage ? (
            <div 
              className={`drop-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept="image/*" 
                hidden 
                ref={fileInputRef} 
                onChange={handleFileInput} 
              />
              <div className="drop-zone-content">
                <div className="upload-icon-container">
                  <Upload size={32} className="upload-icon" />
                </div>
                <h3>Drag & Drop your image here</h3>
                <p>or click to browse</p>
              </div>
            </div>
          ) : (
            <div className="image-preview-container">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="image-preview" 
                ref={imageRef}
                onLoad={runAnalysis}
                crossOrigin="anonymous"
              />
              
              {isProcessing && (
                <div className="processing-overlay glass">
                  <Loader2 size={40} className="spinner" />
                  <p>Analyzing image with AI...</p>
                </div>
              )}
              
              {!isProcessing && predictions.length > 0 && (
                <div className="predictions-results">
                  <p className="success-text">Image analyzed! Found matching terms:</p>
                  <div className="tags-container">
                    {extractSearchTerms(predictions).slice(0, 5).map((term, i) => (
                      <span key={i} className="prediction-tag">{term}</span>
                    ))}
                  </div>
                  <p className="redirect-text">Searching catalog...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSearchModal;
