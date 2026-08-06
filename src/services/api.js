import axios from 'axios';

const runtimeConfig = typeof window !== 'undefined' ? window.APP_CONFIG : undefined;

const api = axios.create({
  baseURL: runtimeConfig?.VITE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 (expired/invalid token) log the user out
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
