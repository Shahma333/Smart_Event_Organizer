import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_ORIGIN, // Ensure this is correctly set in .env
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
