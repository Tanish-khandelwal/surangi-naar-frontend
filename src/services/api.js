import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token or Admin Token
api.interceptors.request.use(
  (config) => {
    const adminToken = sessionStorage.getItem('surangi_admin_token');
    const userToken = localStorage.getItem('surangi_access_token');

    // For admin routes, strictly use adminToken from sessionStorage
    const token = config.url?.includes('/admin') ? adminToken : (userToken || adminToken);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto Refresh Token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/admin/login')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('surangi_refresh_token');
        if (refreshToken) {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          if (res.data?.success && res.data?.token) {
            localStorage.setItem('surangi_access_token', res.data.token);
            if (res.data.refreshToken) {
              localStorage.setItem('surangi_refresh_token', res.data.refreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('surangi_access_token');
        localStorage.removeItem('surangi_refresh_token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
