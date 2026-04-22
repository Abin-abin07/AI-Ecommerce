import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const total = getCartTotal() * 1.08; // including 8% tax

  // If cart is empty and not on success page, redirect
  if (cart.length === 0 && !isSuccess) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <Navbar />
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
      <Navbar />
      <div className="container page checkout-page">
        <button className="back-btn" onClick={() => navigate('/cart')}>
          <ArrowLeft size={20} /> Back to Cart
        </button>
        
        <div className="checkout-content">
          <div className="checkout-form-section glass">
            <h2>Checkout</h2>
            
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" className="input" required value={formData.firstName} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" className="input" required value={formData.lastName} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" className="input" required value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <div className="form-section">
                <h3>Shipping Address</h3>
                <div className="form-group">
                  <label htmlFor="address">Street Address</label>
                  <input type="text" id="address" name="address" className="input" required value={formData.address} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" name="city" className="input" required value={formData.city} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zipCode">Zip Code</label>
                    <input type="text" id="zipCode" name="zipCode" className="input" required value={formData.zipCode} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Payment Details</h3>
                <p className="mock-payment-warning">Simulation only - Do not enter real credit card info.</p>
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input type="text" id="cardNumber" name="cardNumber" className="input" required placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiry">Expiry Date</label>
                    <input type="text" id="expiry" name="expiry" className="input" required placeholder="MM/YY" value={formData.expiry} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input type="text" id="cvv" name="cvv" className="input" required placeholder="123" value={formData.cvv} onChange={handleChange} />
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
