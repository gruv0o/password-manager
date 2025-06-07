// frontend/src/components/VaultList.js
import React, { useEffect, useState } from "react";
import { api } from "../api";
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";
import VaultForm from "./VaultForm";

export default function VaultList() {
    const [entries, setEntries] = useState([]);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);

    const fetchVault = async () => {
        try {
            const res = await api.get("vault/");
            setEntries(res.data);
        } catch {
            setError("Impossible de charger les mots de passe.");
        }
    };

    useEffect(() => {
        fetchVault();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSuccess = () => {
        handleClose();
        fetchVault();
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">Mes mots de passe</Typography>
                <Button variant="contained" onClick={handleOpen}>Ajouter</Button>
            </Box>

            {error && <Typography color="error">{error}</Typography>}

            <List sx={{ mt: 2 }}>
                {entries.length === 0
                    ? <ListItem><ListItemText primary="Aucune entrée" /></ListItem>
                    : entries.map(e => (
                        <ListItem key={e.id} divider>
                            <ListItemText
                                primary={e.name}
                                secondary={`Login: ${e.login} — MDP: ${e.decrypted_password}`}
                            />
                        </ListItem>
                    ))
                }
            </List>

            {/* Modal pour le formulaire */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Ajouter un mot de passe</DialogTitle>
                <DialogContent>
                    <VaultForm onSuccess={handleSuccess} />
                </DialogContent>
            </Dialog>
        </Container>
    );
}
