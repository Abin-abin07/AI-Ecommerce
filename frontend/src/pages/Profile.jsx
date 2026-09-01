import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { User, MapPin, Package, Heart, Trash2, ShoppingCart } from 'lucide-react';
import './Profile.css';

const MOCK_ORDERS = [
  {
    id: 'ORD-1029',
    date: '2026-08-15',
    status: 'Delivered',
    total: 129.99,
    items: [
      { id: 1, title: 'Wireless Noise-Cancelling Headphones', quantity: 1, price: 129.99 }
    ]
  },
  {
    id: 'ORD-1030',
    date: '2026-08-18',
    status: 'Processing',
    total: 45.00,
    items: [
      { id: 2, title: 'Smart Home Hub', quantity: 1, price: 45.00 }
    ]
  }
];

const Profile = () => {
  const { user, logout, getAccessToken, updateUser } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabParam || 'personal');
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const getAuthToken = () => {
    const directToken = localStorage.getItem('token') || localStorage.getItem('access') || localStorage.getItem('access_token');
    if (directToken) return directToken;
    
    // Also try the tokens object from our AuthContext storage
    const tokensObj = localStorage.getItem('tokens');
    if (tokensObj) {
      try {
        const parsed = JSON.parse(tokensObj);
        if (parsed.access) return parsed.access;
      } catch (e) { /* ignore */ }
    }

    const userObj = localStorage.getItem('user');
    if (userObj) {
      try {
        const parsed = JSON.parse(userObj);
        return parsed.access || parsed.token || parsed.access_token || parsed.tokens?.access;
      } catch (e) { return null; }
    }
    return null;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      // Use fallback getAuthToken if context doesn't have it ready yet
      const token = getAccessToken() || getAuthToken();
      console.log("Retrieved token for profile fetch:", token);

      if (!token) {
        console.warn("No token found in localStorage. Skipping profile fetch.");
        return;
      }

      try {
        const res = await axios.get('http://localhost:8000/api/auth/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.data) {
          setPersonalDetails({
            firstName: res.data.first_name || '',
            lastName: res.data.last_name || '',
            email: res.data.email || '',
            phone: res.data.phone || res.data.mobile_number || ''
          });
          setAddress({
            address: res.data.address || '',
            city: res.data.city || '',
            state: res.data.state || '',
            zip_code: res.data.zip_code || ''
          });
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.data?.code === 'token_not_valid') {
          localStorage.removeItem('token');
          localStorage.removeItem('access');
          localStorage.removeItem('user');
          window.location.href = '/login'; // Redirect to login page
        }
        console.error("Profile Fetch Failed:", err.response?.status, err.response?.data);
      }
    };
    fetchProfile();
  }, [getAccessToken]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const [personalDetails, setPersonalDetails] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [address, setAddress] = useState({
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zip_code: user?.zip_code || ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handlePersonalDetailsChange = (e) => {
    setPersonalDetails({ ...personalDetails, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'city' || name === 'state') {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setErrors(prev => ({ ...prev, [name]: 'City and State must contain only letters (no numbers or special characters).' }));
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'zip_code') {
      if (!/^\d*$/.test(value) || (value.replace(/\D/g, '').length > 0 && value.replace(/\D/g, '').length !== 6)) {
        setErrors(prev => ({ ...prev, zip_code: 'ZIP Code must be exactly 6 digits (numbers only, no letters or special characters).' }));
      } else {
        setErrors(prev => ({ ...prev, zip_code: '' }));
      }
      newValue = value.replace(/\D/g, '').slice(0, 6);
    }

    setAddress({ ...address, [name]: newValue });
  };

  const savePersonalDetails = async (e) => {
    e.preventDefault();
    if (errors.phone) return;
    if (personalDetails.phone && personalDetails.phone.length !== 10) {
      setErrors(prev => ({ ...prev, phone: 'Mobile number must be exactly 10 digits.' }));
      return;
    }
    setErrors(prev => ({ ...prev, phone: '' }));

    try {
      const token = getAccessToken();
      const response = await axios.put('http://localhost:8000/api/auth/profile/update/', {
        first_name: personalDetails.firstName,
        last_name: personalDetails.lastName,
        phone: personalDetails.phone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      updateUser(response.data.user);
      showToast('Personal details saved successfully!');
    } catch (err) {
      if (err.response?.status === 401 || err.response?.data?.code === 'token_not_valid') {
        localStorage.removeItem('token');
        localStorage.removeItem('access');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redirect to login page
      }
      console.error("Failed to update personal details:", err);
      showToast('Failed to update details. Please try again.', 'error');
    }
  };

  const saveAddress = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!address.city.trim() || !/^[a-zA-Z\s]+$/.test(address.city)) {
      newErrors.city = 'City and State must contain only letters (no numbers or special characters).';
    }
    if (!address.state.trim() || !/^[a-zA-Z\s]+$/.test(address.state)) {
      newErrors.state = 'City and State must contain only letters (no numbers or special characters).';
    }
    if (!address.zip_code || address.zip_code.length !== 6) {
      newErrors.zip_code = 'ZIP Code must be exactly 6 digits (numbers only, no letters or special characters).';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }

    try {
      const token = getAccessToken();
      const payload = {
        address: address.address,
        city: address.city,
        state: address.state,
        zip_code: address.zip_code
      };

      const response = await axios.put(
        'http://localhost:8000/api/auth/profile/update/',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      updateUser(response.data.user);
      showToast('Address saved successfully!');
    } catch (err) {
      if (err.response?.status === 401 || err.response?.data?.code === 'token_not_valid') {
        localStorage.removeItem('token');
        localStorage.removeItem('access');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redirect to login page
      }
      console.error("Address Save API Error Response:", err.response?.data || err.message);
      showToast(
        err.response?.data?.detail || 
        err.response?.data?.message || 
        "Failed to save address. Please check your token or input fields.", 
        'error'
      );
    }
  };

  return (
    <div className="container profile-page">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="profile-sidebar glass">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={40} />
          </div>
          <h3>{user?.first_name || user?.username || 'User'}</h3>
          <p>{user?.email}</p>
        </div>
        <nav className="profile-nav">
          <button 
            className={`profile-nav-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => handleTabChange('personal')}
          >
            <User size={18} /> Personal Details
          </button>
          <button 
            className={`profile-nav-btn ${activeTab === 'address' ? 'active' : ''}`}
            onClick={() => handleTabChange('address')}
          >
            <MapPin size={18} /> Saved Addresses
          </button>
          <button 
            className={`profile-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => handleTabChange('orders')}
          >
            <Package size={18} /> Order History
          </button>
          <button 
            className={`profile-nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => handleTabChange('wishlist')}
          >
            <Heart size={18} /> Wishlist
          </button>
          <button className="profile-nav-btn logout-btn" onClick={logout}>
            Logout
          </button>
        </nav>
      </div>

      <div className="profile-content glass">
        {activeTab === 'personal' && (
          <div className="profile-tab-content">
            <h2>Personal Details</h2>
            <form onSubmit={savePersonalDetails} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" name="firstName" value={personalDetails.firstName} onChange={handlePersonalDetailsChange} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={personalDetails.lastName} onChange={handlePersonalDetailsChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={personalDetails.email} onChange={handlePersonalDetailsChange} />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  name="phone"
                  maxLength={10}
                  value={personalDetails.phone || ''}
                  className={errors.phone ? 'invalid' : ''}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const containsInvalidChars = /[^0-9]/.test(inputValue);

                    if (containsInvalidChars) {
                      setErrors(prev => ({ ...prev, phone: 'Letters and special characters are not allowed. Only numbers (0–9) are accepted.' }));
                    } else if (inputValue.length > 0 && inputValue.length < 10) {
                      setErrors(prev => ({ ...prev, phone: 'Mobile number must be exactly 10 digits.' }));
                    } else {
                      setErrors(prev => ({ ...prev, phone: '' }));
                    }

                    const cleanDigits = inputValue.replace(/\D/g, '').slice(0, 10);
                    setPersonalDetails(prev => ({ ...prev, phone: cleanDigits }));
                  }}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-400 font-medium">
                    {errors.phone}
                  </p>
                )}
              </div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          </div>
        )}

        {activeTab === 'address' && (
          <div className="profile-tab-content">
            <h2>Saved Addresses</h2>
            {user?.address && (
              <div className="saved-address-display">
                <h4>Primary Address</h4>
                <p>{user.address}</p>
                <p>{user.city}, {user.state} {user.zip_code}</p>
              </div>
            )}
            
            <h3 className="mt-4">Update Address</h3>
            <form onSubmit={saveAddress} className="profile-form mt-2">
              <div className="form-group">
                <label>Street Address</label>
                <input type="text" name="address" value={address.address} onChange={handleAddressChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={address.city} 
                    onChange={handleAddressChange} 
                    className={errors.city ? 'invalid' : ''}
                    required 
                  />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input 
                    type="text" 
                    name="state" 
                    value={address.state} 
                    onChange={handleAddressChange} 
                    className={errors.state ? 'invalid' : ''}
                    required 
                  />
                  {errors.state && <span className="error-text">{errors.state}</span>}
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input 
                    type="text" 
                    name="zip_code" 
                    value={address.zip_code} 
                    onChange={handleAddressChange} 
                    className={errors.zip_code ? 'invalid' : ''}
                    maxLength="6"
                    required 
                  />
                  {errors.zip_code && <span className="error-text">{errors.zip_code}</span>}
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Save Address</button>
            </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="profile-tab-content">
            <h2>Order History</h2>
            <div className="orders-list">
              {MOCK_ORDERS.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <span className="order-id">{order.id}</span>
                      <span className="order-date">{order.date}</span>
                    </div>
                    <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                  </div>
                  <div className="order-items">
                    {order.items.map(item => (
                      <div key={item.id} className="order-item">
                        <span>{item.quantity}x {item.title}</span>
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="profile-tab-content">
            <h2>My Wishlist</h2>
            {wishlist.length === 0 ? (
              <p>Your wishlist is currently empty.</p>
            ) : (
              <div className="wishlist-grid">
                {wishlist.map(product => (
                  <div key={product.id} className="wishlist-card">
                    <img src={product.image} alt={product.title} className="wishlist-image" />
                    <div className="wishlist-details">
                      <h4>{product.title}</h4>
                      <p className="wishlist-price">${product.price.toFixed(2)}</p>
                      <div className="wishlist-actions">
                        <button 
                          className="btn btn-outline small"
                          onClick={() => removeFromWishlist(product.id)}
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                        <button 
                          className="btn btn-primary small"
                          onClick={() => {
                            addToCart(product);
                            removeFromWishlist(product.id);
                          }}
                        >
                          <ShoppingCart size={16} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
