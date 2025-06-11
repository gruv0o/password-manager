from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import PasswordEntry
from .serializers import PasswordEntrySerializer

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class PasswordEntryViewSet(viewsets.ModelViewSet):
    """
    GET /api/vault/                → liste des entrées de l’utilisateur
    POST /api/vault/               → création d’une nouvelle entrée
    GET /api/vault/{pk}/           → détail (avec mot de passe déchiffré)
    PUT/PATCH /api/vault/{pk}/     → mise à jour (chiffre nouveau mot de passe si fourni)
    DELETE /api/vault/{pk}/        → suppression
    """
    serializer_class = PasswordEntrySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        # Ne retourne que les entrées appartenant à l’utilisateur connecté
        return PasswordEntry.objects.filter(owner=self.request.user)
