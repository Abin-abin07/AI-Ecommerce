import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUserActivity } from '../context/UserActivityContext';

import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { trackProductView } = useUserActivity();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to product details
    addToCart(product);
  };

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="product-card glass"
      onClick={() => trackProductView(product)}
    >
      <div className="product-image-container">
        <img 
          src={product.image.includes('placeholder') ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800' : product.image} 
          alt={product.title} 
          className="product-image" 
          loading="lazy" 
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'; }}
        />
      </div>
      <div className="product-content">
        <div className="product-category">{product.category}</div>
        <h3 className="product-title" title={product.title}>{product.title}</h3>
        
        <div className="product-rating">
          <Star size={14} className="star-icon" fill="currentColor" />
          <span>{product.rating?.rate || 4.5}</span>
          <span className="rating-count">({product.rating?.count || 0})</span>
        </div>

        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button className="add-to-cart-btn" onClick={handleAddToCart} aria-label="Add to cart">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
