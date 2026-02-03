import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, Truck, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
    const { isAuthenticated } = useAuth();
    const featuredAnime = [
        { name: 'Naruto', image: '/Naruto.jpg', color: '#ff6b35' },
        { name: 'One Piece', image: '/one piece T- shirt.jpg', color: '#e63946' },
        { name: 'Demon Slayer', image: '/demonslayer.jpg', color: '#2ec4b6' },
        { name: 'Attack on Titan', image: '/aot.jpg', color: '#6c757d' },
    ];

    const features = [
        { icon: <Sparkles />, title: 'Premium Quality', desc: 'High-quality fabric and printing' },
        { icon: <Truck />, title: 'Fast Shipping', desc: 'Free shipping on orders over ₹999' },
        { icon: <Shield />, title: 'Secure Payment', desc: 'Safe and secure checkout' },
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <span className="hero-badge">🎌 New Collection 2026</span>
                    <h1 className="hero-title">
                        Wear Your <span className="gradient-text">Anime</span> Pride
                    </h1>
                    <p className="hero-description">
                        Discover premium anime-inspired clothing that lets you express your passion.
                        From iconic designs to limited editions, find your perfect style.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/products" className="btn btn-primary btn-lg">
                            <ShoppingBag size={20} />
                            Shop Now
                        </Link>
                        <Link to="/products?category=Hoodie" className="btn btn-ghost btn-lg">
                            View Hoodies
                        </Link>
                    </div>
                </div>

            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Collections */}
            <section className="collections-section">
                <div className="section-header">
                    <h2>Shop by <span className="gradient-text">Anime</span></h2>
                    <p>Explore collections from your favorite series</p>
                </div>
                <div className="collections-grid">
                    {featuredAnime.map((anime, index) => (
                        <Link
                            key={index}
                            to={`/products?anime=${encodeURIComponent(anime.name)}`}
                            className="collection-card"
                            style={{ '--accent-color': anime.color }}
                        >
                            <div className="collection-image">
                                <img src={anime.image} alt={anime.name} />
                                <div className="collection-overlay"></div>
                            </div>
                            <div className="collection-info">
                                <h3>{anime.name}</h3>
                                <span>View Collection →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="section-header">
                    <h2>Shop by <span className="gradient-text">Category</span></h2>
                    <p>Find your perfect style</p>
                </div>
                <div className="categories-grid">
                    <Link to="/products?category=Hoodie" className="category-card category-hoodie">
                        <h3>Hoodies</h3>
                        <span>Cozy & Stylish</span>
                    </Link>
                    <Link to="/products?category=T-Shirt" className="category-card category-tshirt">
                        <h3>T-Shirts</h3>
                        <span>Everyday Essentials</span>
                    </Link>
                    <Link to="/products?category=Jacket" className="category-card category-jacket">
                        <h3>Jackets</h3>
                        <span>Make a Statement</span>
                    </Link>
                    <Link to="/products?category=Accessories" className="category-card category-accessories">
                        <h3>Accessories</h3>
                        <span>Complete Your Look</span>
                    </Link>
                </div>
            </section>

            {/* CTA Section - Only show when not logged in */}
            {!isAuthenticated && (
                <section className="cta-section">
                    <div className="cta-content">
                        <h2>Join the AnimeWear Community</h2>
                        <p>Get exclusive access to limited editions, early releases, and special discounts.</p>
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Sign Up Now
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
