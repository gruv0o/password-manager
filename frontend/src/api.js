// frontend/src/api.js

import axios from "axios";

// On configure une instance Axios dont le baseURL pointe vers "/api/".
// Grâce au "proxy" dans package.json ("http://localhost:8000"),
// toute requête à "/api/..." sera redirigée vers Django.
export const api = axios.create({
    baseURL: "http://localhost:8000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercepteur pour injecter automatiquement le JWT dans l’en-tête Authorization
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
