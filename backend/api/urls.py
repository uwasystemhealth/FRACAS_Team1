from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from .views import (
    CategoryViewSet,
    CommentViewSet,
    RecordViewSet,
    SubcategoryViewSet,
    TeamViewSet,
    UserViewSet,
)

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

# register viewsets with router
router.register(r"users", UserViewSet, basename="user")
router.register(r"teams", TeamViewSet, basename="team")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"subcategories", SubcategoryViewSet, basename="subcategory")
router.register(r"records", RecordViewSet, basename="record")
router.register(r"comments", CommentViewSet, basename="comment")


app_name = "api"
urlpatterns = router.urls
