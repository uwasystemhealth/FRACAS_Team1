from django.conf import settings
from django.urls import path
from rest_framework.authtoken import views
from rest_framework.routers import DefaultRouter, SimpleRouter

from .views import (
    CarViewSet,
    CommentViewSet,
    RecordViewSet,
    SubsystemViewSet,
    TeamViewSet,
    UserLogout,
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
router.register(r"cars", CarViewSet, basename="car")
router.register(r"records", RecordViewSet, basename="record")
router.register(r"comments", CommentViewSet, basename="comment")


# authentication views
urlpatterns = [
    path("login", views.obtain_auth_token, name="login"),
    path("logout", UserLogout.as_view(), name="logout"),
]

urlpatterns += router.urls
