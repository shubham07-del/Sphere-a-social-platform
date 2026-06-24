import axios from 'axios';

// Create a custom axios instance
const api = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:3000/api', // Uses relative path in production, absolute path in development
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
