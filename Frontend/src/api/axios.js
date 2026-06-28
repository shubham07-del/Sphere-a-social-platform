import axios from 'axios';

// Create a custom axios instance
const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://sphere-a-social-platform-1.onrender.com';
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

// Add a request interceptor to automatically attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
