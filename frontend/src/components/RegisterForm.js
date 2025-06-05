// frontend/src/components/RegisterForm.js
import React, { useState, useContext } from "react";
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Alert,
} from "@mui/material";
import AuthContext from "../contexts/AuthContext";

export default function RegisterForm() {
    const { register } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await register(username, email, password);
            setSuccess("Inscription réussie ! Vous êtes maintenant connecté.");
            // Vous pouvez rediriger vers une autre page (par ex. le vault) si désiré
        } catch (err) {
            // L’API renvoie un objet JSON avec les erreurs
            setError(
                err.response?.data?.username
                    ? err.response.data.username
                    : "Erreur lors de l’inscription"
            );
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h5" align="center">
                Inscription
            </Typography>
            <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}
                <TextField
                    label="Nom d'utilisateur"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Mot de passe"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    S'inscrire
                </Button>
            </Box>
        </Container>
    );
}
