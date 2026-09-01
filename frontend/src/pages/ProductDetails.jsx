import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Truck, ShieldCheck, Heart } from 'lucide-react';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import { useUserActivity } from '../context/UserActivityContext';
import { useWishlist } from '../context/WishlistContext';
// import Navbar removed – header provided by ProtectedLayout
import ProductReviews from '../components/ProductReviews';
import { generateMockReviews, MOCK_PRODUCTS } from '../utils/mockData';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addToCart } = useCart();
  const { trackProductView } = useUserActivity();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [reviews, setReviews] = useState([]);
  const reviewsRef = React.useRef(null);

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        // Use type-safe lookup in local MOCK_PRODUCTS as requested
        let data = MOCK_PRODUCTS.find(p => p.id === Number(id));
        
        if (!data) {
          data = await fetchProductById(id);
        }

        if (data) {
          setProduct(data);
          trackProductView(data);
          setReviews(generateMockReviews(data.id, data.category));
        } else {
          console.log("Product not found. ID:", id);
        }
      } catch (error) {
        console.error("Error loading product", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [id, trackProductView]);

  if (isLoading) {
    return (
      <>
        
        <div className="container page loading-container">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-line title"></div>
            <div className="skeleton-line price"></div>
            <div className="skeleton-line desc"></div>
            <div className="skeleton-actions">
              <div className="skeleton-btn"></div>
              <div className="skeleton-btn"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        
        <div className="container page error-container">
          <h2>Product not found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </>
    );
  }

  return (
    <>
      
      <div className="container page product-details-page">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>

        <div className="product-details-content glass">
          <div className="product-image-section">
            <button 
              className={`wishlist-btn-detail ${isInWishlist(product.id) ? 'active' : ''}`} 
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle Wishlist"
            >
              <Heart size={24} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
            </button>
            <img src={product.image} alt={product.title} className="detail-image" />
          </div>
          
          <div className="product-info-section">
            <div className="category-badge">{product.category}</div>
            <h1 className="detail-title">{product.title}</h1>
            
            <div className="detail-rating clickable" onClick={scrollToReviews}>
              <Star size={18} fill="#fbbf24" color="#fbbf24" />
              <span className="rating-score">{product.rating?.rate || 4.5}</span>
              <span className="rating-count">({product.rating?.count || 400} reviews)</span>
            </div>
            
            <div className="detail-price">${product.price.toFixed(2)}</div>
            
            <p className="detail-description">{product.description}</p>
            
            <div className="features-list">
              <div className="feature-item">
                <Truck size={20} className="feature-icon" />
                <span>Free shipping worldwide</span>
              </div>
              <div className="feature-item">
                <ShieldCheck size={20} className="feature-icon" />
                <span>2 year warranty</span>
              </div>
            </div>
            
            <div className="action-buttons">
              <button 
                className="btn btn-secondary btn-large add-btn"
                onClick={() => addToCart(product)}
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button 
                className="btn btn-primary btn-large buy-btn"
                onClick={() => {
                  addToCart(product);
                  navigate('/checkout');
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <div ref={reviewsRef}>
          <ProductReviews reviews={reviews} />
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
