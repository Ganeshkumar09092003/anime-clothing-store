import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Loading from '../../components/Loading/Loading';
import './Cart.css';

const Cart = () => {
    const { cart, loading, cartTotal, updateCartItem, removeFromCart } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = async (productId, size, currentQty, change) => {
        const newQty = currentQty + change;
        if (newQty < 1) {
            await removeFromCart(productId, size);
        } else {
            await updateCartItem(productId, size, newQty);
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (loading && cart.items.length === 0) {
        return <Loading text="Loading cart..." />;
    }

    return (
        <div className="cart-page">
            <div className="cart-header">
                <h1>Shopping Cart</h1>
                <span>{cart.items.length} items</span>
            </div>

            {cart.items.length === 0 ? (
                <div className="empty-cart">
                    <ShoppingBag size={64} />
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <Link to="/products" className="btn btn-primary">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="cart-container">
                    <div className="cart-items">
                        {cart.items.map((item, index) => (
                            <div key={`${item.product?._id || item.product}-${item.size}-${index}`} className="cart-item">
                                <div className="item-image">
                                    <img
                                        src={
                                            // Handle both object format {url: '...'} and string format
                                            item.product?.images?.[0]?.url ||
                                            item.product?.images?.[0] ||
                                            '/placeholder-product.png'
                                        }
                                        alt={item.product?.name || 'Product'}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder-product.png';
                                        }}
                                    />
                                </div>
                                <div className="item-details">
                                    <div className="item-info">
                                        <Link
                                            to={`/products/${item.product?._id || item.product}`}
                                            className="item-name"
                                        >
                                            {item.product?.name || 'Product'}
                                        </Link>
                                        <div className="item-meta">
                                            <span className="item-anime">{item.product?.anime}</span>
                                            <span className="item-size">Size: {item.size}</span>
                                        </div>
                                        <span className="item-price">₹{item.price.toLocaleString()}</span>
                                    </div>

                                    <div className="item-actions">
                                        <div className="quantity-control">
                                            <button
                                                onClick={() => handleQuantityChange(
                                                    item.product?._id || item.product,
                                                    item.size,
                                                    item.quantity,
                                                    -1
                                                )}
                                                disabled={loading}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(
                                                    item.product?._id || item.product,
                                                    item.size,
                                                    item.quantity,
                                                    1
                                                )}
                                                disabled={loading}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.product?._id || item.product, item.size)}
                                            disabled={loading}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="item-total">
                                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toLocaleString()}</span>
                        </div>

                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className={cartTotal >= 999 ? 'free' : ''}>
                                {cartTotal >= 999 ? 'FREE' : '₹99'}
                            </span>
                        </div>

                        {cartTotal < 999 && (
                            <div className="shipping-note">
                                Add ₹{(999 - cartTotal).toLocaleString()} more for free shipping!
                            </div>
                        )}

                        <div className="summary-divider"></div>

                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{(cartTotal + (cartTotal >= 999 ? 0 : 99)).toLocaleString()}</span>
                        </div>

                        <button
                            className="btn btn-primary btn-lg checkout-btn"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                            <ArrowRight size={20} />
                        </button>

                        <Link to="/products" className="continue-shopping">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
