// frontend/src/components/LoginForm.js
import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Alert,
} from "@mui/material";

export default function LoginForm({ onLogin }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        console.log("SENDING LOGIN:", { username, password });

        try {
            const res = await api.post("accounts/login/", { username, password });
            console.log("LOGIN RESPONSE:", res.data);
            // Stocker dans localStorage
            localStorage.setItem("access_token", res.data.access);
            localStorage.setItem("refresh_token", res.data.refresh);
            if (typeof onLogin === "function") {
                onLogin();
            }
            // Redirection vers la liste du vault
            navigate("/vault");
        } catch (err) {
            setError("Identifiants invalides");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center">
                Connexion
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    label="Nom d'utilisateur"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Mot de passe"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Se connecter
                </Button>
            </Box>
        </Container>
    );
}
