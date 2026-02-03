import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ordersAPI } from '../../services/api';
import { MapPin, Phone, CreditCard, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'cod',
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cart.items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        try {
            setLoading(true);
            const idempotencyKey = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const { data } = await ordersAPI.create(idempotencyKey);

            setOrderId(data.data._id);
            setOrderPlaced(true);
            clearCart();
            toast.success('Order placed successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const shippingCost = cartTotal >= 999 ? 0 : 99;
    const totalAmount = cartTotal + shippingCost;

    if (orderPlaced) {
        return (
            <div className="checkout-page">
                <div className="order-success">
                    <div className="success-icon">
                        <CheckCircle size={64} />
                    </div>
                    <h1>Order Placed Successfully!</h1>
                    <p>Thank you for your order. We'll send you a confirmation email shortly.</p>
                    <div className="order-details-box">
                        <span>Order ID</span>
                        <strong>#{orderId.slice(-8).toUpperCase()}</strong>
                    </div>
                    <div className="success-actions">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/orders')}
                        >
                            View Orders
                        </button>
                        <button
                            className="btn btn-ghost"
                            onClick={() => navigate('/products')}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>

            <div className="checkout-container">
                <form onSubmit={handleSubmit} className="checkout-form">
                    {/* Shipping Info */}
                    <div className="form-section">
                        <h2>
                            <MapPin size={20} />
                            Shipping Address
                        </h2>

                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="phone">Phone Number</label>
                                <div className="phone-input">
                                    <span>+91</span>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        pattern="[0-9]{10}"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="address">Address</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="House/Flat No., Street, Landmark"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="state">State</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="pincode">PIN Code</label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    placeholder="6-digit PIN"
                                    pattern="[0-9]{6}"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="form-section">
                        <h2>
                            <CreditCard size={20} />
                            Payment Method
                        </h2>

                        <div className="payment-options">
                            <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={formData.paymentMethod === 'cod'}
                                    onChange={handleChange}
                                />
                                <div className="payment-content">
                                    <span className="payment-title">Cash on Delivery</span>
                                    <span className="payment-desc">Pay when you receive</span>
                                </div>
                            </label>

                            <label className={`payment-option ${formData.paymentMethod === 'online' ? 'selected' : ''} disabled`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="online"
                                    disabled
                                />
                                <div className="payment-content">
                                    <span className="payment-title">Online Payment</span>
                                    <span className="payment-desc">Coming Soon</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg place-order-btn"
                        disabled={loading || cart.items.length === 0}
                    >
                        {loading ? 'Placing Order...' : `Place Order • ₹${totalAmount.toLocaleString()}`}
                    </button>
                </form>

                {/* Order Summary */}
                <div className="order-summary">
                    <h2>Order Summary</h2>

                    <div className="summary-items">
                        {cart.items.map((item, index) => (
                            <div key={`${item.product?._id}-${item.size}-${index}`} className="summary-item">
                                <div className="summary-item-image">
                                    <img
                                        src={item.product?.images?.[0] || 'https://via.placeholder.com/60x75'}
                                        alt={item.product?.name}
                                    />
                                    <span className="item-qty">{item.quantity}</span>
                                </div>
                                <div className="summary-item-info">
                                    <span className="item-name">{item.product?.name}</span>
                                    <span className="item-details">Size: {item.size}</span>
                                </div>
                                <span className="item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <div className="summary-totals">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className={shippingCost === 0 ? 'free' : ''}>
                                {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                            </span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
