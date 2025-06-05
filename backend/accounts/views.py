# backend/accounts/views.py

from django.contrib.auth import authenticate
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, ChangePasswordSerializer

class RegisterView(generics.CreateAPIView):
    """
    POST /api/accounts/register/
    Body JSON attendu : { "username": "...", "email": "...", "password": "..." }
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print(">>> LOGINVIEW RAW SOURCE LOADED <<<")
        print(">>> RAW BODY BYTES  <<<", request.body)
        print("DEBUG LoginView, request.data =", request.data)
        username = request.data.get("username")
        password = request.data.get("password")
        print(f"DEBUG Trying to auth {username!r} / {password!r}")
        print(f">>> Trying to authenticate: {username!r} / {password!r}")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            # succès…
            refresh = RefreshToken.for_user(user)
            return Response({"access": str(refresh.access_token), "refresh": str(refresh)}, status=status.HTTP_200_OK)
        print("DEBUG: authenticate returned None")
        return Response({"detail": "Identifiants invalides"}, status=status.HTTP_401_UNAUTHORIZED)

class ChangePasswordView(APIView):
    """
    POST /api/accounts/change-password/
    Body JSON attendu : { "old_password": "...", "new_password": "..." }
    Nécessite un header Authorization: Bearer <access_token>
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        user = request.user
        if serializer.is_valid():
            old_pwd = serializer.validated_data["old_password"]
            if not user.check_password(old_pwd):
                return Response({"old_password": "Mot de passe incorrect"}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data["new_password"])
            user.save()
            return Response({"detail": "Mot de passe mis à jour"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
