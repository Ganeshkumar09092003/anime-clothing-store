import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productsAPI } from '../../services/api';
import { Upload, Plus, Package, Trash2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import './Admin.css';

const Admin = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        anime: '',
        category: '',
        isLimitedEdition: false,
        variants: [
            { size: 'S', stock: '' },
            { size: 'M', stock: '' },
            { size: 'L', stock: '' },
            { size: 'XL', stock: '' },
        ],
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!isAdmin) {
            toast.error('Admin access required');
            navigate('/');
            return;
        }
        fetchProducts();
    }, [isAdmin, navigate]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await productsAPI.getAll({ limit: 100 });
            setProducts(data.data);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleVariantChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map((v, i) =>
                i === index ? { ...v, [field]: value } : v
            )
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            toast.error('Please select an image');
            return;
        }

        // Validate variants have stock
        const validVariants = formData.variants.filter(v => v.stock && parseInt(v.stock) > 0);
        if (validVariants.length === 0) {
            toast.error('Please add stock for at least one size');
            return;
        }

        try {
            setUploading(true);

            // Create FormData for multipart upload
            const uploadData = new FormData();
            uploadData.append('name', formData.name);
            uploadData.append('description', formData.description);
            uploadData.append('price', formData.price);
            uploadData.append('anime', formData.anime);
            uploadData.append('category', formData.category);
            uploadData.append('isLimitedEdition', formData.isLimitedEdition);
            uploadData.append('images', imageFile);

            // Add variants
            validVariants.forEach((variant, index) => {
                uploadData.append(`variants[${index}][size]`, variant.size);
                uploadData.append(`variants[${index}][stock]`, variant.stock);
            });

            await productsAPI.create(uploadData);

            toast.success('Product created successfully!');
            setShowForm(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create product');
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            anime: '',
            category: '',
            isLimitedEdition: false,
            variants: [
                { size: 'S', stock: '' },
                { size: 'M', stock: '' },
                { size: 'L', stock: '' },
                { size: 'XL', stock: '' },
            ],
        });
        setImageFile(null);
        setImagePreview(null);
    };

    const animeOptions = ['Naruto', 'One Piece', 'Demon Slayer', 'Attack on Titan', 'My Hero Academia', 'Jujutsu Kaisen', 'Dragon Ball'];
    const categoryOptions = ['Hoodie', 'T-Shirt', 'Jacket', 'Accessories'];

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Welcome, {user?.name}! Manage your products here.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {/* Add Product Form */}
            {showForm && (
                <div className="admin-form-container">
                    <h2>Add New Product</h2>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Naruto Sage Mode Hoodie"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Price (₹) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 2499"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your product..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Anime Series *</label>
                                <select
                                    name="anime"
                                    value={formData.anime}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Anime</option>
                                    {animeOptions.map(anime => (
                                        <option key={anime} value={anime}>{anime}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categoryOptions.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Stock by Size *</label>
                            <div className="variants-grid">
                                {formData.variants.map((variant, index) => (
                                    <div key={variant.size} className="variant-input">
                                        <span className="size-label">{variant.size}</span>
                                        <input
                                            type="number"
                                            value={variant.stock}
                                            onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Product Image *</label>
                            <div className="image-upload-area">
                                {imagePreview ? (
                                    <div className="image-preview">
                                        <img src={imagePreview} alt="Preview" />
                                        <button
                                            type="button"
                                            className="remove-image"
                                            onClick={() => {
                                                setImageFile(null);
                                                setImagePreview(null);
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="upload-placeholder">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            hidden
                                        />
                                        <ImageIcon size={40} />
                                        <span>Click to upload image</span>
                                        <small>JPG, PNG up to 10MB</small>
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isLimitedEdition"
                                    checked={formData.isLimitedEdition}
                                    onChange={handleInputChange}
                                />
                                <span>Limited Edition</span>
                            </label>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => {
                                    setShowForm(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <Upload size={18} className="spinning" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        Create Product
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Products List */}
            <div className="admin-products">
                <h2>
                    <Package size={24} />
                    Products ({products.length})
                </h2>

                {loading ? (
                    <p className="loading-text">Loading products...</p>
                ) : products.length === 0 ? (
                    <div className="no-products">
                        <Package size={48} />
                        <p>No products yet. Add your first product!</p>
                    </div>
                ) : (
                    <div className="products-table-container">
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Anime</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id}>
                                        <td>
                                            <img
                                                src={product.images?.[0] || 'https://via.placeholder.com/60'}
                                                alt={product.name}
                                                className="product-thumb"
                                            />
                                        </td>
                                        <td>
                                            <span className="product-name">{product.name}</span>
                                            {product.isLimitedEdition && (
                                                <span className="limited-tag">Limited</span>
                                            )}
                                        </td>
                                        <td>{product.anime}</td>
                                        <td>{product.category}</td>
                                        <td>₹{product.price.toLocaleString()}</td>
                                        <td>
                                            {product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
