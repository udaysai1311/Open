import axios from 'axios';
import { getToken } from '../utils/auth';

// Create an instance of axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add a request interceptor to add the token to the header
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Unauthorized, maybe token expired
            // Optionally clear cookies and redirect to login
            console.warn('Unauthorized access - potential token expiration');
        }
        return Promise.reject(error);
    }
);

export default api;
