import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCart({ items: [] });
            return;
        }

        try {
            setLoading(true);
            const { data } = await cartAPI.get();
            setCart(data.data || { items: [] });
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, size, quantity = 1) => {
        try {
            setLoading(true);
            const { data } = await cartAPI.add({ productId, size, quantity });
            setCart(data.data);
            toast.success('Added to cart!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateCartItem = async (productId, size, quantity) => {
        try {
            setLoading(true);
            const { data } = await cartAPI.update({ productId, size, quantity });
            setCart(data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update cart');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (productId, size) => {
        try {
            setLoading(true);
            const { data } = await cartAPI.remove({ productId, size });
            setCart(data.data);
            toast.success('Removed from cart');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove from cart');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const clearCart = () => {
        setCart({ items: [] });
    };

    const cartTotal = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const cartCount = cart.items.reduce((count, item) => count + item.quantity, 0);

    const value = {
        cart,
        loading,
        cartTotal,
        cartCount,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
