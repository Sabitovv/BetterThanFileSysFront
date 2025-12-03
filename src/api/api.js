// src/api/api.js

import axios from 'axios';

// 1. Создаем экземпляр Axios
const api = axios.create({
    // Здесь мы используем VITE_API_URL, как в вашем Code.jsx
    baseURL: import.meta.env.VITE_API_URL, 
});

// 2. Настройка Перехватчика Запросов (Request Interceptor)
api.interceptors.request.use(
    (config) => {
        // Получаем токен из localStorage
        const token = localStorage.getItem('authToken'); 

        // Если токен существует, добавляем его в заголовок Authorization
        if (token) {
            // Формат Bearer Token: 'Bearer ' + токен
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Обработка ошибок, если что-то пойдет не так с запросом
        return Promise.reject(error);
    }
);

// 3. Экспортируем настроенный экземпляр
export default api;