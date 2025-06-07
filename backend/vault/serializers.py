# backend/vault/serializers.py
from rest_framework import serializers
from .models import PasswordEntry

class PasswordEntrySerializer(serializers.ModelSerializer):
    # On expose un champ "password" en clair dans l’API, qui sera chiffré en interne
    password = serializers.CharField(write_only=True, required=True)
    decrypted_password = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PasswordEntry
        fields = [
            "id",
            "name",
            "login",
            "password",           # utilisé à la création ou modification
            "decrypted_password", # renvoyé en lecture
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data):
        user = self.context["request"].user
        raw_pwd = validated_data.pop("password")
        entry = PasswordEntry(owner=user, **validated_data)
        entry.set_password(raw_pwd)
        entry.save()
        return entry

    def update(self, instance, validated_data):
        # Si l’utilisateur fournit un nouveau "password", on le chiffre
        new_pwd = validated_data.pop("password", None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        if new_pwd:
            instance.set_password(new_new_password := new_pwd)
        instance.save()
        return instance

    def get_decrypted_password(self, obj):
        return obj.get_password()
