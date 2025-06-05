import React, { useEffect, useState } from "react";
import { api } from "../api";
import {
    Container,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Button,
} from "@mui/material";

export default function VaultList() {
    const [entries, setEntries] = useState([]);
    const [error, setError] = useState(null);

    const fetchEntries = async () => {
        try {
            const res = await api.get("vault/");
            setEntries(res.data);
        } catch (err) {
            setError("Impossible de récupérer vos entrées");
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" align="center">
                Mes mots de passe
            </Typography>
            {error && (
                <Typography color="error" align="center" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
            <Box sx={{ mt: 2 }}>
                <List>
                    {entries.map((entry) => (
                        <ListItem key={entry.id} divider>
                            <ListItemText
                                primary={`${entry.name} — ${entry.login}`}
                                secondary={`Mot de passe : ${entry.decrypted_password}`}
                            />
                            {/* On pourra ajouter boutons Modifier / Supprimer ici */}
                            <Button variant="outlined" sx={{ ml: 2 }}>
                                Modifier
                            </Button>
                            <Button variant="contained" color="error" sx={{ ml: 1 }}>
                                Supprimer
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
}
