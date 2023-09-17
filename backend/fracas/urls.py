from django.contrib import admin
from django.urls import include, path

# example url: http://localhost:8000/api/users/username/
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls", namespace="api")),
]
