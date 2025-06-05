// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import * as jwt_decode from "jwt-decode";

// On installe jwt-decode : npm install jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // À l'initialisation, on regarde si un token est présent
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const decoded = jwt_decode(token);
                setUser({ username: decoded.username, id: decoded.user_id });
                // On pourrait aussi vérifier la date d’expiration (decoded.exp)
            } catch {
                localStorage.removeItem("access_token");
                setUser(null);
            }
        }
    }, []);

    const login = async (username, password) => {
        // Appel à /api/accounts/login/
        const response = await api.post("/accounts/login/", { username, password });
        const { access, refresh } = response.data;
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        // Mettre à jour l’état user
        const decoded = jwt_decode(access);
        setUser({ username: decoded.username, id: decoded.user_id });
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
    };

    const register = async (username, email, password) => {
        // Appel à /api/accounts/register/
        await api.post("/accounts/register/", { username, email, password });
        // On peut directement appeler login pour être connecté après inscription, si on veut :
        return login(username, password);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
