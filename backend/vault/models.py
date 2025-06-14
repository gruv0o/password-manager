# backend/vault/models.py
from django.conf import settings
from django.db import models
from cryptography.fernet import Fernet, InvalidToken
import base64

class PasswordEntry(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="password_entries"
    )
    name = models.CharField(max_length=150)        # ex : "GitHub"
    login = models.CharField(max_length=150)       # ex : "monemail@example.com"
    encrypted_password = models.BinaryField()      # on stocke ici le mot de passe chiffré
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def set_password(self, raw_password: str):
        key = settings.VAULT_KEY.encode()
        f = Fernet(key)
        token = f.encrypt(raw_password.encode())
        self.encrypted_password = token

    def get_password(self) -> str:
        key = settings.VAULT_KEY.encode()
        f = Fernet(key)
        try:
            token = self.encrypted_password
            if isinstance(token, memoryview):
                token = token.tobytes()
            if isinstance(token, str):
                token = token.encode()
            raw = f.decrypt(token)
            return raw.decode()
        except InvalidToken:
            return ""

    def __str__(self):
        return f"{self.name} ({self.login})"
