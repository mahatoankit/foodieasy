import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/users/auth/token/refresh/`,
            { refresh: refreshToken }
          );

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
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
  register: (userData) => api.post('/users/auth/register/', userData),
  login: (credentials) => api.post('/users/auth/login/', credentials),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.patch('/users/profile/', data),
  changePassword: (data) => api.post('/users/change-password/', data),
};

// Restaurant API
export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants/', { params }),
  getById: (id) => api.get(`/restaurants/${id}/`),
  getMyRestaurant: () => api.get('/restaurants/my_restaurant/'),
  create: (data) => api.post('/restaurants/', data),
  update: (id, data) => api.patch(`/restaurants/${id}/`, data),
  getMenu: (restaurantId) => api.get(`/restaurants/${restaurantId}/menu/`),
};

// Menu Item API
export const menuItemAPI = {
  getAll: (params) => api.get('/menu-items/', { params }),
  getById: (id) => api.get(`/menu-items/${id}/`),
  getMyMenu: () => api.get('/menu-items/my_menu/'),
  create: (data) => api.post('/menu-items/', data),
  update: (id, data) => api.patch(`/menu-items/${id}/`, data),
  delete: (id) => api.delete(`/menu-items/${id}/`),
};

// Order API
export const orderAPI = {
  getAll: (params) => api.get('/orders/', { params }),
  getById: (id) => api.get(`/orders/${id}/`),
  getMyOrders: () => api.get('/orders/my_orders/'),
  getPendingOrders: () => api.get('/orders/pending_orders/'),
  create: (orderData) => api.post('/orders/', orderData),
  updateStatus: (id, statusData) => api.post(`/orders/${id}/update_status/`, statusData),
  assignRider: (id, riderData) => api.post(`/orders/${id}/assign_rider/`, riderData),
  track: (id) => api.get(`/orders/${id}/track/`),
};

export default api;
