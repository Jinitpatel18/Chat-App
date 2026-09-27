import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    timeout: 10000,
});

api.interceptors.response.use(
    (res) => res,
    (error) => {
        console.error('API error:', error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

export const fetchMessages = async () => {
    const { data } = await api.get('/messages');
    return data.data;
};

export const postMessage = async (username, text) => {
    const { data } = await api.post('/messages', { username, text });
    return data.data;
};

export default api;