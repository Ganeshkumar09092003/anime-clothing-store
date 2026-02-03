import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User, LogOut, Menu, X, Package, Settings } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src="/logo.png" alt="AnimeWear" className="logo-img" />
                    <span className="logo-text">AnimeWear</span>
                </Link>

                <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                        Home
                    </Link>
                    <Link to="/products" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                        Shop
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/orders" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                <Package size={18} />
                                <span>Orders</span>
                            </Link>
                            <Link to="/cart" className="nav-link cart-link" onClick={() => setMobileMenuOpen(false)}>
                                <ShoppingCart size={20} />
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </Link>
                            {isAdmin && (
                                <Link to="/admin" className="nav-link admin-link" onClick={() => setMobileMenuOpen(false)}>
                                    <Settings size={18} />
                                    <span>Admin</span>
                                </Link>
                            )}
                            <div className="user-menu">
                                <button className="user-button">
                                    <User size={18} />
                                    <span>{user?.name}</span>
                                </button>
                                <button className="logout-button" onClick={handleLogout}>
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-ghost" onClick={() => setMobileMenuOpen(false)}>
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
