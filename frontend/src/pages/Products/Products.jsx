import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loading from '../../components/Loading/Loading';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import './Products.css';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        anime: searchParams.get('anime') || '',
        category: searchParams.get('category') || '',
        size: searchParams.get('size') || '',
        sort: searchParams.get('sort') || '',
        page: parseInt(searchParams.get('page')) || 1,
    });

    const animeOptions = ['Naruto', 'One Piece', 'Demon Slayer', 'Attack on Titan', 'Dragon Ball', 'My Hero Academia', 'Jujutsu Kaisen'];
    const categoryOptions = ['Hoodie', 'T-Shirt', 'Jacket', 'Accessories'];
    const sizeOptions = ['S', 'M', 'L', 'XL'];
    const sortOptions = [
        { value: '', label: 'Newest First' },
        { value: 'price', label: 'Price: Low to High' },
        { value: '-price', label: 'Price: High to Low' },
    ];

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.anime) params.anime = filters.anime;
            if (filters.category) params.category = filters.category;
            if (filters.size) params.size = filters.size;
            if (filters.sort) params.sort = filters.sort;
            params.page = filters.page;
            params.limit = 12;

            const { data } = await productsAPI.getAll(params);
            setProducts(data.data);
            setPagination(data.pagination);

            // Update URL params
            const newParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value) newParams.set(key, value);
            });
            setSearchParams(newParams);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({ anime: '', category: '', size: '', sort: '', page: 1 });
    };

    const hasActiveFilters = filters.anime || filters.category || filters.size;

    return (
        <div className="products-page">
            {/* Header */}
            <div className="products-header">
                <div className="products-header-content">
                    <h1>
                        {filters.anime || filters.category ? (
                            <>
                                {filters.anime && <span className="filter-title">{filters.anime}</span>}
                                {filters.anime && filters.category && <span> • </span>}
                                {filters.category && <span className="filter-title">{filters.category}s</span>}
                            </>
                        ) : (
                            'All Products'
                        )}
                    </h1>
                    <p>{pagination.total} products found</p>
                </div>
            </div>

            <div className="products-container">
                {/* Mobile Filter Toggle */}
                <button
                    className="mobile-filter-toggle"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <SlidersHorizontal size={18} />
                    Filters
                    {hasActiveFilters && <span className="filter-count">•</span>}
                </button>

                {/* Sidebar Filters */}
                <aside className={`filters-sidebar ${showFilters ? 'active' : ''}`}>
                    <div className="filters-header">
                        <h3>
                            <SlidersHorizontal size={18} />
                            Filters
                        </h3>
                        <button className="close-filters" onClick={() => setShowFilters(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    {hasActiveFilters && (
                        <button className="clear-filters" onClick={clearFilters}>
                            Clear All Filters
                        </button>
                    )}

                    {/* Anime Filter */}
                    <div className="filter-group">
                        <h4>Anime Series</h4>
                        <div className="filter-options">
                            {animeOptions.map(anime => (
                                <label key={anime} className="filter-option">
                                    <input
                                        type="radio"
                                        name="anime"
                                        checked={filters.anime === anime}
                                        onChange={() => handleFilterChange('anime', filters.anime === anime ? '' : anime)}
                                    />
                                    <span>{anime}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="filter-group">
                        <h4>Category</h4>
                        <div className="filter-options">
                            {categoryOptions.map(cat => (
                                <label key={cat} className="filter-option">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={filters.category === cat}
                                        onChange={() => handleFilterChange('category', filters.category === cat ? '' : cat)}
                                    />
                                    <span>{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Size Filter */}
                    <div className="filter-group">
                        <h4>Size</h4>
                        <div className="size-options">
                            {sizeOptions.map(size => (
                                <button
                                    key={size}
                                    className={`size-btn ${filters.size === size ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="filter-group">
                        <h4>Sort By</h4>
                        <select
                            value={filters.sort}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                            className="sort-select"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </aside>

                {/* Products Grid */}
                <main className="products-main">
                    {loading ? (
                        <Loading text="Loading products..." />
                    ) : products.length === 0 ? (
                        <div className="no-products">
                            <Search size={48} />
                            <h3>No products found</h3>
                            <p>Try adjusting your filters or search criteria</p>
                            <button className="btn btn-primary" onClick={clearFilters}>
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="products-grid">
                                {products.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="pagination-btn"
                                        disabled={filters.page === 1}
                                        onClick={() => handleFilterChange('page', filters.page - 1)}
                                    >
                                        Previous
                                    </button>
                                    <span className="pagination-info">
                                        Page {filters.page} of {pagination.pages}
                                    </span>
                                    <button
                                        className="pagination-btn"
                                        disabled={filters.page === pagination.pages}
                                        onClick={() => handleFilterChange('page', filters.page + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Products;
