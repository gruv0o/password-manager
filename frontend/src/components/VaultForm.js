// frontend/src/components/VaultForm.js
import React, { useState } from "react";
import { api } from "../api";
import {
    TextField,
    Button,
    Box,
    Alert,
} from "@mui/material";

export default function VaultForm({ onSuccess }) {
    const [name, setName] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await api.post("vault/", { name, login, password, notes });
            onSuccess();
        } catch (err) {
            setError("Impossible d’enregistrer l’entrée");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, minWidth: 400 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
                label="Nom du service"
                fullWidth
                margin="normal"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <TextField
                label="Login"
                fullWidth
                margin="normal"
                value={login}
                onChange={e => setLogin(e.target.value)}
            />
            <TextField
                label="Mot de passe"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <TextField
                label="Notes (optionnel)"
                fullWidth
                margin="normal"
                multiline
                minRows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                Enregistrer
            </Button>
        </Box>
    );
}
