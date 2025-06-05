import React, { useState } from "react";
import { api } from "../api";
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Alert,
} from "@mui/material";

export default function VaultForm({ existingEntry, onSuccess }) {
    // existingEntry est l’objet à modifier (ou null pour création)
    const [name, setName] = useState(existingEntry?.name || "");
    const [login, setLogin] = useState(existingEntry?.login || "");
    const [password, setPassword] = useState("");
    const [notes, setNotes] = useState(existingEntry?.notes || "");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (existingEntry) {
                // mise à jour
                const payload = { name, login, notes };
                if (password) payload.password = password;
                await api.patch(`vault/${existingEntry.id}/`, payload);
            } else {
                // création
                await api.post("vault/", { name, login, password, notes });
            }
            onSuccess();
        } catch (err) {
            setError("Erreur lors de l’enregistrement");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center">
                {existingEntry ? "Modifier une entrée" : "Ajouter un mot de passe"}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    label="Nom du service"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    label="Identifiant"
                    fullWidth
                    margin="normal"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
                <TextField
                    label="Mot de passe"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    label="Notes"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    {existingEntry ? "Mettre à jour" : "Ajouter"}
                </Button>
            </Box>
        </Container>
    );
}
