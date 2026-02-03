import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading/Loading';
import { ShoppingCart, Heart, ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart, loading: cartLoading } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const { data } = await productsAPI.getById(id);
            setProduct(data.data);
            // Pre-select first available size
            const availableSize = data.data.variants?.find(v => v.stock > 0);
            if (availableSize) setSelectedSize(availableSize.size);
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Product not found');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }

        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }

        try {
            await addToCart(product._id, selectedSize, quantity);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const selectedVariant = product?.variants?.find(v => v.size === selectedSize);
    const isOutOfStock = !selectedVariant || selectedVariant.stock === 0;
    const maxQuantity = selectedVariant?.stock || 1;

    if (loading) {
        return <Loading text="Loading product..." />;
    }

    if (!product) {
        return null;
    }

    return (
        <div className="product-detail">
            <button className="back-button" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} />
                Back
            </button>

            <div className="product-detail-container">
                {/* Image Gallery */}
                <div className="product-gallery">
                    <div className="main-image">
                        {product.isLimitedEdition && (
                            <span className="limited-badge">Limited Edition</span>
                        )}
                        <img
                            src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x800?text=No+Image'}
                            alt={product.name}
                        />
                    </div>
                    {product.images?.length > 1 && (
                        <div className="thumbnail-list">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img src={img} alt={`${product.name} ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="product-info-detail">
                    <div className="product-meta">
                        <span className="anime-badge">{product.anime}</span>
                        <span className="category-tag">{product.category}</span>
                    </div>

                    <h1 className="product-title">{product.name}</h1>

                    <div className="product-price-detail">
                        <span className="price">₹{product.price.toLocaleString()}</span>
                        <span className="price-note">Inclusive of all taxes</span>
                    </div>

                    <p className="product-description">{product.description}</p>

                    {/* Size Selection */}
                    <div className="size-section">
                        <div className="size-header">
                            <span>Select Size</span>
                            {selectedVariant && (
                                <span className="stock-info">
                                    {selectedVariant.stock > 5
                                        ? <span className="in-stock"><Check size={14} /> In Stock</span>
                                        : <span className="low-stock">Only {selectedVariant.stock} left!</span>
                                    }
                                </span>
                            )}
                        </div>
                        <div className="size-options-detail">
                            {product.variants?.map((variant) => (
                                <button
                                    key={variant.size}
                                    className={`size-option ${selectedSize === variant.size ? 'selected' : ''} ${variant.stock === 0 ? 'disabled' : ''}`}
                                    onClick={() => variant.stock > 0 && setSelectedSize(variant.size)}
                                    disabled={variant.stock === 0}
                                >
                                    {variant.size}
                                    {variant.stock === 0 && <span className="sold-out-line"></span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="quantity-section">
                        <span>Quantity</span>
                        <div className="quantity-selector">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span>{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => Math.min(maxQuantity, q + 1))}
                                disabled={quantity >= maxQuantity}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="product-actions">
                        <button
                            className="btn btn-primary btn-lg add-to-cart-btn"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || cartLoading}
                        >
                            <ShoppingCart size={20} />
                            {isOutOfStock ? 'Out of Stock' : cartLoading ? 'Adding...' : 'Add to Cart'}
                        </button>
                        <button className="btn btn-ghost btn-lg wishlist-btn">
                            <Heart size={20} />
                        </button>
                    </div>

                    {/* Product Details */}
                    <div className="product-details-section">
                        <h3>Product Details</h3>
                        <ul>
                            <li><strong>Anime:</strong> {product.anime}</li>
                            <li><strong>Category:</strong> {product.category}</li>
                            <li><strong>Material:</strong> Premium Cotton Blend</li>
                            <li><strong>Care:</strong> Machine wash cold, tumble dry low</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
