import React from 'react';
import './Skeleton.css';

export const ProductSkeleton = () => (
  <div className="product-card skeleton">
    <div className="skeleton-image-box"></div>
    <div className="skeleton-info">
      <div className="skeleton-line short"></div>
      <div className="skeleton-line medium"></div>
      <div className="skeleton-line long"></div>
    </div>
  </div>
);

export const TextSkeleton = ({ width = '100%', height = '1rem' }) => (
  <div 
    className="skeleton-line" 
    style={{ width, height, margin: '0.5rem 0' }}
  ></div>
);
