import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Camera, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = ({ onOpenImageSearch, onTextSearch }) => {
  const { cart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onTextSearch) {
      onTextSearch(searchTerm);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onTextSearch) {
      onTextSearch(value);
    }
  };

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" aria-label="Nexis Logo">
          Nexis
        </Link>

        <div className="navbar-search">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={handleInputChange}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <Search size={18} />
            </button>
          </form>
          <button 
            className="ai-search-btn" 
            onClick={onOpenImageSearch}
            title="AI Image Search"
          >
            <Camera size={20} />
            <span className="ai-badge">AI</span>
          </button>
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-link">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
