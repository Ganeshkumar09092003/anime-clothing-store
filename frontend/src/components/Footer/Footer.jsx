import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3 className="footer-logo">
                        <img src="/logo.png" alt="AnimeWear" className="footer-logo-img" />
                        <span>AnimeWear</span>
                    </h3>
                    <p className="footer-description">
                        Your one-stop shop for premium anime-inspired clothing.
                        Express your love for anime with style!
                    </p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Shop</Link></li>
                        <li><Link to="/products?anime=Naruto">Naruto Collection</Link></li>
                        <li><Link to="/products?anime=One Piece">One Piece Collection</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Categories</h4>
                    <ul className="footer-links">
                        <li><Link to="/products?category=Hoodie">Hoodies</Link></li>
                        <li><Link to="/products?category=T-Shirt">T-Shirts</Link></li>
                        <li><Link to="/products?category=Jacket">Jackets</Link></li>
                        <li><Link to="/products?category=Accessories">Accessories</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Contact</h4>
                    <ul className="footer-links">
                        <li>📧 ganeshsvv82@gmail.com</li>
                        <li>📞 +91 9363195116</li>
                        <li>📍 Hosur, India</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 AnimeWear. All rights reserved.</p>
                <p>Made with ❤️ for anime fans</p>
            </div>
        </footer>
    );
};

export default Footer;
