// frontend/src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Au chargement initial, on restaure user si username/token en localStorage
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const storedUsername = localStorage.getItem("username");

        if (token && storedUsername) {
            setUser({ username: storedUsername });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post("accounts/login/", { username, password });
            console.log("LOGIN RESPONSE:", response.data);

            const { access, refresh } = response.data;

            if (!access) {
                throw new Error("Pas de token reçu lors du login");
            }

            // Stockage des tokens
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
            // Stockage username pour persistance
            localStorage.setItem("username", username);

            setUser({ username });
            return response.data;
        } catch (error) {
            console.error("Erreur lors du login:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");
        setUser(null);
        window.location.href = "/login";
    };

    const register = async (username, email, password) => {
        try {
            // Appel inscription
            const resRegister = await api.post("accounts/register/", {
                username,
                email,
                password
            });
            console.log("REGISTER RESPONSE:", resRegister.data);

            // Si l'API renvoie directement les tokens :
            if (resRegister.data.access && resRegister.data.refresh) {
                const { access, refresh } = resRegister.data;
                localStorage.setItem("access_token", access);
                localStorage.setItem("refresh_token", refresh);
                localStorage.setItem("username", username);
                setUser({ username });
                return resRegister.data;
            }

            // Sinon on fait login pour récupérer les tokens
            return await login(username, password);
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);
            throw error;
        }
    };

    const value = {
        user,
        login,
        logout,
        register,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;