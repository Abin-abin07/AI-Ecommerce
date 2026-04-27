import React from 'react';
import { Star } from 'lucide-react';
import './ProductReviews.css';

const ProductReviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>No reviews yet for this product.</p>
      </div>
    );
  }

  return (
    <section className="reviews-section">
      <h2 className="reviews-title">Customer Reviews</h2>
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-card glass">
            <div className="review-header">
              <div className="review-user">
                <div className="user-avatar">
                  {review.userName.charAt(0)}
                </div>
                <div className="user-info">
                  <span className="user-name">{review.userName}</span>
                  <span className="review-date">{review.date}</span>
                </div>
              </div>
              <div className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < review.rating ? "#fbbf24" : "none"} 
                    color={i < review.rating ? "#fbbf24" : "#cbd5e1"} 
                  />
                ))}
              </div>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductReviews;
