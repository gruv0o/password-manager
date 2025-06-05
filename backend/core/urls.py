# backend/core/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def ping(request):
    return JsonResponse({"status": "ok", "message": "pong"})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("ping/", ping),  # endpoint de test
    path("api/accounts/", include("accounts.urls")),
    path("api/vault/", include("vault.urls")),
]
