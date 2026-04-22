import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const total = getCartTotal();

  return (
    <>
      <Navbar />
      <div className="container page cart-page">
        <div className="cart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Your Shopping Cart</h1>
          {cart.length > 0 && (
            <Link to="/" className="btn btn-secondary">
              <ArrowLeft size={18} /> Continue Shopping
            </Link>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart glass">
            <ShoppingBag size={64} className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any AI-powered deals yet!</p>
            <Link to="/" className="btn btn-primary mt-4">Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item glass">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  
                  <div className="cart-item-details">
                    <Link to={`/product/${item.id}`} className="cart-item-title">
                      {item.title}
                    </Link>
                    <div className="cart-item-price">${item.price.toFixed(2)}</div>
                  </div>
                  
                  <div className="cart-item-quantity">
                    <button 
                      className="qty-btn" 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="cart-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <button 
                    className="remove-btn" 
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-summary glass">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row">
                <span>Tax (estimated)</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total-row">
                <span>Total</span>
                <span>${(total * 1.08).toFixed(2)}</span>
              </div>
              
              <button 
                className="btn btn-primary btn-checkout"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
