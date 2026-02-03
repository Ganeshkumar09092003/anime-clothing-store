import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { _id, name, price, anime, category, images, isLimitedEdition, variants } = product;

    const totalStock = variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
    const isOutOfStock = totalStock === 0;

    return (
        <Link to={`/products/${_id}`} className="product-card">
            {isLimitedEdition && (
                <span className="limited-badge">Limited Edition</span>
            )}
            {isOutOfStock && (
                <span className="out-of-stock-badge">Out of Stock</span>
            )}

            <div className="product-image-container">
                <img
                    src={images?.[0] || 'https://via.placeholder.com/300x400?text=No+Image'}
                    alt={name}
                    className="product-image"
                />
                <div className="product-overlay">
                    <span className="view-details">View Details</span>
                </div>
            </div>

            <div className="product-info">
                <span className="product-anime">{anime}</span>
                <h3 className="product-name">{name}</h3>
                <span className="product-category">{category}</span>
                <div className="product-footer">
                    <span className="product-price">₹{price.toLocaleString()}</span>
                    <div className="product-sizes">
                        {variants?.map((v) => (
                            <span
                                key={v.size}
                                className={`size-tag ${v.stock === 0 ? 'out' : ''}`}
                            >
                                {v.size}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
