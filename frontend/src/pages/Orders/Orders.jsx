import { useState, useEffect, useCallback } from 'react';
import { ordersAPI } from '../../services/api';
import Loading from '../../components/Loading/Loading';
import { Package, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await ordersAPI.getMyOrders({
                page: pagination.page,
                limit: pagination.limit,
            });
            setOrders(data.data);
            setPagination(prev => ({ ...prev, total: data.pagination.total }));
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        try {
            const idempotencyKey = `cancel-${orderId}-${Date.now()}`;
            await ordersAPI.cancel(orderId, idempotencyKey);
            toast.success('Order cancelled successfully');
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="status-icon pending" />;
            case 'paid':
                return <CheckCircle className="status-icon paid" />;
            case 'cancelled':
                return <XCircle className="status-icon cancelled" />;
            case 'failed':
                return <AlertCircle className="status-icon failed" />;
            default:
                return <Clock className="status-icon" />;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading && orders.length === 0) {
        return <Loading text="Loading orders..." />;
    }

    return (
        <div className="orders-page">
            <div className="orders-header">
                <h1>My Orders</h1>
                <p>{pagination.total} orders</p>
            </div>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <Package size={64} />
                    <h2>No orders yet</h2>
                    <p>Start shopping to see your orders here.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                                    <span className="order-date">{formatDate(order.createdAt)}</span>
                                </div>
                                <div className={`order-status status-${order.status}`}>
                                    {getStatusIcon(order.status)}
                                    <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                                </div>
                            </div>

                            <div className="order-items">
                                {order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <div className="order-item-image">
                                            <img
                                                src={item.image?.url || 'https://via.placeholder.com/60x75?text=Item'}
                                                alt={item.anime}
                                            />
                                        </div>
                                        <div className="order-item-details">
                                            <span className="item-anime">{item.anime}</span>
                                            <span className="item-specs">
                                                {item.category} • Size {item.size} • Qty {item.quantity}
                                            </span>
                                        </div>
                                        <span className="item-price">₹{item.price.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <div className="order-total">
                                    <span>Total</span>
                                    <span className="total-amount">₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                                {order.status === 'pending' && (
                                    <button
                                        className="btn btn-ghost cancel-order-btn"
                                        onClick={() => handleCancelOrder(order._id)}
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.total > pagination.limit && (
                <div className="orders-pagination">
                    <button
                        className="pagination-btn"
                        disabled={pagination.page === 1}
                        onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                    >
                        Previous
                    </button>
                    <span>
                        Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                    </span>
                    <button
                        className="pagination-btn"
                        disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                        onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Orders;