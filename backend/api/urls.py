from django.conf import settings
from django.urls import path
from rest_framework.routers import DefaultRouter, SimpleRouter

from .views import (
    CommentViewSet,
    RecordViewSet,
    SubsystemViewSet,
    TeamViewSet,
    UserLogin,
    UserLogout,
    UserRegister,
    UserViewSet,
)

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

app_name = "api"

# register viewsets with router
router.register(r"users", UserViewSet, basename="user")
router.register(r"teams", TeamViewSet, basename="team")
router.register(r"subsystems", SubsystemViewSet, basename="subsystem")
router.register(r"records", RecordViewSet, basename="record")
router.register(r"comments", CommentViewSet, basename="comment")

# authentication views
urlpatterns = [
    path("register", UserRegister.as_view(), name="register"),
    path("login", UserLogin.as_view(), name="login"),
    path("logout", UserLogout.as_view(), name="logout"),
]

urlpatterns += router.urls
