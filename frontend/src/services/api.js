// frontend/src/services/api.js
import axios from "axios";

// Par défaut, create-react-app pointe vers http://localhost:3000. On veut ici
// que Axios envoie ses requêtes à Django (http://localhost:8000).
// Comme on a mis "proxy": "http://localhost:8000" dans package.json,
// on peut simplement utiliser des chemins relatifs ("/api/...").

const api = axios.create({
    baseURL: "/api", // toutes les requêtes seront préfixées par /api
});

// Intercepteur pour ajouter automatiquement le token si présent
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
