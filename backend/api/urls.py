from django.conf import settings
from django.urls import include, path
from rest_framework.routers import DefaultRouter, SimpleRouter

from .views import (
    CategoryViewSet,
    CommentViewSet,
    ReportViewSet,
    SubcategoryViewSet,
    TeamViewSet,
    UserViewSet,
)

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()


router.register("users", UserViewSet)
router.register("teams", TeamViewSet)
router.register("reports", ReportViewSet)
router.register("comments", CommentViewSet)
router.register("categories", CategoryViewSet)
router.register("subcategories", SubcategoryViewSet)


app_name = "api"
urlpatterns = router.urls
