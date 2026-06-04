import axios from 'axios';

const HF_BASE_URL = import.meta.env.VITE_HF_BASE_URL || '';

const api = axios.create({
  baseURL: HF_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token when present
api.interceptors.request.use(
  (config) => {
    const token = import.meta.env.VITE_HF_API_TOKEN;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap data or surface errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Unknown error';
    return Promise.reject(new Error(message));
  }
);

export { api };
export default api;