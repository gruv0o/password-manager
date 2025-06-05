// frontend/src/App.js
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Button from "@mui/material/Button";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import VaultList from "./components/VaultList";
import VaultForm from "./components/VaultForm";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
      !!localStorage.getItem("access_token")
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
  };

  return (
      <BrowserRouter>
        <Routes>
          <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/vault" /> : <RegisterForm />}
          />
            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        <Navigate to="/vault" />
                    ) : (
                        <LoginForm onLogin={handleLogin} />
                    )
                }
            />
          <Route
              path="/vault"
              element={
                isAuthenticated ? (
                    <VaultList />
                ) : (
                    <Navigate to="/login" replace />
                )
              }
          />
          <Route
              path="/vault/new"
              element={
                isAuthenticated ? (
                    <VaultForm onSuccess={() => window.location.replace("/vault")} />
                ) : (
                    <Navigate to="/login" replace />
                )
              }
          />
          <Route
              path="/vault/edit/:id"
              element={
                isAuthenticated ? (
                    // Pour le mode édition, il faudrait charger l’entrée existante, par exemple via un fetch
                    <VaultForm onSuccess={() => window.location.replace("/vault")} />
                ) : (
                    <Navigate to="/login" replace />
                )
              }
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/vault" : "/login"} />} />
        </Routes>
        {isAuthenticated && (
            <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{ position: "fixed", top: 16, right: 16 }}
            >
              Déconnexion
            </Button>
        )}
      </BrowserRouter>
  );
}

export default App;
