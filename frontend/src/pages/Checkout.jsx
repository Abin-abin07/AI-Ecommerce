import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
// import Navbar removed – header provided by ProtectedLayout
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || user?.first_name || '',
    lastName: user?.lastName || user?.last_name || '',
    email: user?.email || user?.email_address || user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const total = getCartTotal() * 1.08; // including 8% tax

  // If cart is empty and not on success page, redirect
  if (cart.length === 0 && !isSuccess) {
    navigate('/cart');
    return null;
  }

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!/^[a-zA-Z]*$/.test(value)) {
          error = 'Names can only contain letters.';
        }
        break;
      case 'city':
      case 'state':
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          error = 'City and State must contain only letters (no numbers or special characters).';
        }
        break;
      case 'zipCode':
        if (!/^\d*$/.test(value)) {
          error = 'ZIP Code must be exactly 6 digits (numbers only, no letters or special characters).';
        } else if (value.length > 0 && value.length !== 6) {
          error = 'ZIP Code must be exactly 6 digits (numbers only, no letters or special characters).';
        }
        break;
      case 'cardNumber':
        if (!/^\d*$/.test(value)) {
          error = 'Card number must be 16 digits (numbers only).';
        } else if (value.length > 16) {
          error = 'Card number must be 16 digits';
        }
        break;
      case 'cvv':
        if (!/^\d*$/.test(value)) {
          error = 'CVV must be a 3-digit number.';
        } else if (value.length > 3) {
          error = 'CVV must be 3 digits';
        }
        break;
      case 'expiry':
        if (!/^[\d/]*$/.test(value)) {
          error = 'Please enter numbers in MM/YY format.';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check for invalid characters before filtering
    const fieldError = validateField(name, value);
    if (fieldError) {
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    } else if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Immediate validation for input restrictions
    let newValue = value;
    
    if (name === 'firstName' || name === 'lastName') {
      newValue = value.replace(/[^a-zA-Z]/g, '');
    } else if (name === 'city' || name === 'state') {
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'zipCode' || name === 'cardNumber' || name === 'cvv') {
      newValue = value.replace(/\D/g, '');
      if (name === 'zipCode') newValue = newValue.slice(0, 6);
      if (name === 'cardNumber') newValue = newValue.slice(0, 16);
      if (name === 'cvv') newValue = newValue.slice(0, 3);
    } else if (name === 'expiry') {
      newValue = value.replace(/[^\d/]/g, '').slice(0, 5);
      // Auto-format MM/YY
      if (newValue.length === 2 && !newValue.includes('/') && value.length > formData.expiry.length) {
        newValue = newValue + '/';
      }
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    else if (!/^[a-zA-Z]+$/.test(formData.firstName)) newErrors.firstName = 'Names can only contain letters.';
    
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    else if (!/^[a-zA-Z]+$/.test(formData.lastName)) newErrors.lastName = 'Names can only contain letters.';
    
    // City validation
    if (!formData.city.trim()) newErrors.city = 'Required';
    else if (!/^[a-zA-Z\s]+$/.test(formData.city)) newErrors.city = 'City and State must contain only letters (no numbers or special characters).';
    
    // State validation
    if (!formData.state.trim()) newErrors.state = 'Required';
    else if (!/^[a-zA-Z\s]+$/.test(formData.state)) newErrors.state = 'City and State must contain only letters (no numbers or special characters).';
    
    // Zipcode validation
    if (!formData.zipCode) {
      newErrors.zipCode = 'Required';
    } else if (!/^\d{6}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'ZIP Code must be exactly 6 digits (numbers only, no letters or special characters).';
    }
    
    // Card Number validation
    if (!formData.cardNumber) newErrors.cardNumber = 'Required';
    else if (!/^\d{16}$/.test(formData.cardNumber)) newErrors.cardNumber = 'Card number must be 16 digits (numbers only).';
    
    // CVV validation
    if (!formData.cvv) newErrors.cvv = 'Required';
    else if (!/^\d{3}$/.test(formData.cvv)) newErrors.cvv = 'CVV must be a 3-digit number.';
    
    // Expiry Date validation
    if (!formData.expiry) {
      newErrors.expiry = 'Required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = 'Please enter numbers in MM/YY format.';
    } else {
      const [month, year] = formData.expiry.split('/').map(Number);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = parseInt(now.getFullYear().toString().slice(-2));
      
      if (month < 1 || month > 12) {
        newErrors.expiry = 'Invalid month';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiry = 'Card has expired.';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call for checkout
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setOrderNumber(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <>
        
        <div className="container page success-page">
          <div className="success-card glass">
            <CheckCircle size={80} className="success-icon" />
            <h1>Payment Successful!</h1>
            <p className="order-number">Order #{orderNumber}</p>
            <p className="success-message">
              Thank you for your purchase. We've received your order and will email you the details shortly.
            </p>
            <Link to="/" className="btn btn-primary btn-continue">
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      
      <div className="container page checkout-page">
        <button className="back-btn" onClick={() => navigate('/cart')}>
          <ArrowLeft size={20} /> Back to Cart
        </button>
        
        <div className="checkout-content">
          <div className="checkout-form-section glass">
            <h2>Checkout</h2>
            
            <form onSubmit={handleSubmit} className="checkout-form">
              {!user && (
              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      className={`input ${errors.firstName ? 'invalid' : ''}`} 
                      required 
                      value={formData.firstName} 
                      onChange={handleChange} 
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      className={`input ${errors.lastName ? 'invalid' : ''}`} 
                      required 
                      value={formData.lastName} 
                      onChange={handleChange} 
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="input" 
                    required 
                    value={formData.email} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              )}

              <div className="form-section">
                <h3>Shipping Address</h3>
                <div className="form-group">
                  <label htmlFor="address">Street Address</label>
                  <input type="text" id="address" name="address" className="input" required value={formData.address} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input 
                      type="text" 
                      id="city" 
                      name="city" 
                      className={`input ${errors.city ? 'invalid' : ''}`} 
                      required 
                      value={formData.city} 
                      onChange={handleChange} 
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input 
                      type="text" 
                      id="state" 
                      name="state" 
                      className={`input ${errors.state ? 'invalid' : ''}`} 
                      required 
                      value={formData.state} 
                      onChange={handleChange} 
                    />
                    {errors.state && <span className="error-text">{errors.state}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code</label>
                    <input 
                      type="text" 
                      id="zipCode" 
                      name="zipCode" 
                      className={`input ${errors.zipCode ? 'invalid' : ''}`} 
                      required 
                      placeholder="000000"
                      maxLength="6"
                      value={formData.zipCode} 
                      onChange={handleChange} 
                    />
                    {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Payment Details</h3>
                <p className="mock-payment-warning">Simulation only - Do not enter real credit card info.</p>
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input 
                    type="text" 
                    id="cardNumber" 
                    name="cardNumber" 
                    className={`input ${errors.cardNumber ? 'invalid' : ''}`} 
                    required 
                    placeholder="0000 0000 0000 0000" 
                    value={formData.cardNumber} 
                    onChange={handleChange} 
                  />
                  {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiry">Expiry Date</label>
                    <input 
                      type="text" 
                      id="expiry" 
                      name="expiry" 
                      className={`input ${errors.expiry ? 'invalid' : ''}`} 
                      required 
                      placeholder="MM/YY" 
                      value={formData.expiry} 
                      onChange={handleChange} 
                    />
                    {errors.expiry && <span className="error-text">{errors.expiry}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input 
                      type="text" 
                      id="cvv" 
                      name="cvv" 
                      className={`input ${errors.cvv ? 'invalid' : ''}`} 
                      required 
                      placeholder="123" 
                      value={formData.cvv} 
                      onChange={handleChange} 
                    />
                    {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          <div className="checkout-summary glass">
            <h3>Order Summary</h3>
            <div className="checkout-items">
              {cart.map(item => (
                <div key={item.id} className="checkout-item">
                  <div className="checkout-item-image">
                    <img src={item.image} alt={item.title} />
                    <span className="checkout-item-qty">{item.quantity}</span>
                  </div>
                  <div className="checkout-item-details">
                    <span className="checkout-item-title">{item.title}</span>
                    <span className="checkout-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total-row">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <div className="secure-checkout">
              <ShieldCheck size={20} className="secure-icon" />
              <span>Secure Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
