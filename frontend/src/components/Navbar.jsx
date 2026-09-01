import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Camera, Search, User, Heart, Package, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { setSearchTerms, setIsImageSearchOpen, clearSearch } from '../store/searchSlice';
import './Navbar.css';

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      dispatch(clearSearch([]));
    } else {
      dispatch(setSearchTerms([searchTerm]));
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value.trim()) {
      dispatch(clearSearch([]));
    } else {
      dispatch(setSearchTerms([value]));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
            onClick={() => dispatch(setIsImageSearchOpen(true))}
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
          
          {isAuthenticated && (
            <div className="user-menu-container" ref={dropdownRef}>
              <button 
                className="user-menu-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User Menu"
              >
                <div className="user-avatar">
                  <User size={20} />
                </div>
              </button>
              
              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <strong>{user?.first_name || user?.username || 'User'}</strong>
                    <span>{user?.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <User size={16} /> Profile & Settings
                  </Link>
                  <Link to="/profile?tab=orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <Package size={16} /> Order History
                  </Link>
                  <Link to="/profile?tab=wishlist" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <Heart size={16} /> Wishlist
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
