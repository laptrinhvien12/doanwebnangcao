// src/utils/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:5000/api', // Địa chỉ Backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm Interceptor để tự động đính kèm Token vào mỗi request nếu có
axiosClient.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;