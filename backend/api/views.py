from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import (
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
)
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .models import Category, Comment, Report, Subcategory, Team
from .serializers import (
    CategorySerializer,
    CommentSerializer,
    ReportSerializer,
    SubcategorySerializer,
    TeamSerializer,
    UserSerializer,
)

User = get_user_model()


# , DestroyModelMixin can be used to add delete for CRUD functionality


# User
# ------------------------------------------------------------------------------
class UserViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
    UpdateModelMixin,
    GenericViewSet,
):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = "username"

    # def get_queryset(self, *args, **kwargs):
    #     assert isinstance(self.request.user.id, int)
    #     return self.queryset.filter(id=self.request.user.id)

    # @action(detail=False)
    # def me(self, request):
    #     serializer = UserSerializer(request.user, context={"request": request})
    #     return Response(status=status.HTTP_200_OK, data=serializer.data)


# Team
# ------------------------------------------------------------------------------
class TeamViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
    UpdateModelMixin,
    GenericViewSet,
):
    serializer_class = TeamSerializer
    queryset = Team.objects.all()
    lookup_field = "team_name"


# Reports
# ------------------------------------------------------------------------------
class ReportViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
    UpdateModelMixin,
    GenericViewSet,
):
    serializer_class = ReportSerializer
    queryset = Report.objects.all()
    lookup_field = "report_id"


# Category
# ------------------------------------------------------------------------------
class CategoryViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
    UpdateModelMixin,
    GenericViewSet,
):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    lookup_field = "category_id"


# Subcategory
# ------------------------------------------------------------------------------
class SubcategoryViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
    UpdateModelMixin,
    GenericViewSet,
):
    serializer_class = SubcategorySerializer
    queryset = Subcategory.objects.all()
    lookup_field = "subcategory_id"


# Comments
# ------------------------------------------------------------------------------
class CommentViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
    UpdateModelMixin,
    GenericViewSet,
):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    lookup_field = "comment_id"
