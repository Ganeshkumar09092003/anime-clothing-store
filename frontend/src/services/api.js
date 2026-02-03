import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle token refresh on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await axios.post(
                    `${API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                localStorage.setItem('accessToken', data.data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    refresh: () => api.post('/auth/refresh'),
};

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (formData) => api.post('/products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

// Cart API
export const cartAPI = {
    get: () => api.get('/cart'),
    add: (data) => api.post('/cart', data),
    update: (data) => api.patch('/cart', data),
    remove: (data) => api.delete('/cart', { data }),
};

// Orders API
export const ordersAPI = {
    create: (idempotencyKey) =>
        api.post('/orders', {}, { headers: { 'Idempotency-Key': idempotencyKey } }),
    getMyOrders: (params) => api.get('/orders/my-orders', { params }),
    cancel: (orderId, idempotencyKey) =>
        api.post(`/orders/${orderId}/cancel`, {}, { headers: { 'Idempotency-Key': idempotencyKey } }),
};

// Payments API
export const paymentsAPI = {
    createIntent: (orderId, idempotencyKey) =>
        api.post('/payments/intent', { orderId }, { headers: { 'Idempotency-Key': idempotencyKey } }),
};

export default api;
