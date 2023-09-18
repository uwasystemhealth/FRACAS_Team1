from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
)
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .models import Category, Comment, Record, Subcategory, Team
from .serializers import (
    CategorySerializer,
    CommentSerializer,
    RecordSerializer,
    SubcategorySerializer,
    TeamSerializer,
    UserSerializer,
)

User = get_user_model()


# XYZModelMixin can be used for CRUD functionality


# User Viewset
# ------------------------------------------------------------------------------
class UserViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
    DestroyModelMixin,
    UpdateModelMixin,
    GenericViewSet,
):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = "username"

    # filter by user id
    # def get_queryset(self, *args, **kwargs):
    #     assert isinstance(self.request.user.id, int)
    #     return self.queryset.filter(id=self.request.user.id)

    # return current user
    # @action(detail=False)
    # def me(self, request):
    #     serializer = UserSerializer(request.user, context={"request": request})
    #     return Response(status=status.HTTP_200_OK, data=serializer.data)


# Team Viewset
# ------------------------------------------------------------------------------
class TeamViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericViewSet,
):
    serializer_class = TeamSerializer
    queryset = Team.objects.all()
    lookup_field = "team_name"

    # return team members
    @action(detail=True, methods=["get"])
    def members(self, request, team_name=None):
        team = self.get_object()
        members = User.objects.filter(team=team)
        serializer = UserSerializer(members, many=True, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(detail=True, methods=["get"])
    def lead(self, request, team_name=None):
        team = self.get_object()
        lead = team.team_lead
        # first_name = lead.split()[0]
        # last_name = lead.split()[1]
        user = User.objects.filter(first_name=lead.first_name, last_name=lead.last_name)
        serializer = UserSerializer(user, many=True, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)


# Category Viewset
# ------------------------------------------------------------------------------
class CategoryViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericViewSet,
):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    lookup_field = "category_name"

    # return all subcategories in a category
    @action(detail=True, methods=["get"])
    def subcategories(self, request, category_name=None):
        category = self.get_object()
        subcategories = Subcategory.objects.filter(parent_category=category).order_by(
            "subcategory_name"
        )
        serializer = SubcategorySerializer(
            subcategories, many=True, context={"request": request}
        )
        return Response(status=status.HTTP_200_OK, data=serializer.data)


# Subcategory Viewset
# ------------------------------------------------------------------------------
class SubcategoryViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericViewSet,
):
    serializer_class = SubcategorySerializer
    queryset = Subcategory.objects.all()
    lookup_field = "subcategory_name"

    # return subcategory's parent category
    @action(detail=True, methods=["get"])
    def parent(self, request, subcategory_name=None):
        subcategory = self.get_object()
        serializer = CategorySerializer(
            subcategory.parent_category, context={"request": request}
        )
        return Response(status=status.HTTP_200_OK, data=serializer.data)


# Records Viewset
# ------------------------------------------------------------------------------
class RecordViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericViewSet,
):
    serializer_class = RecordSerializer
    queryset = Record.objects.all()
    lookup_field = "record_id"

    # return all comments on a record
    @action(detail=True, methods=["get"])
    def comments(self, request, record_id=None):
        record = self.get_object()
        comments = Comment.objects.filter(record_id=record).order_by("creation_time")
        serializer = CommentSerializer(
            comments, many=True, context={"request": request}
        )
        return Response(status=status.HTTP_200_OK, data=serializer.data)


# Comments Viewset
# ------------------------------------------------------------------------------
class CommentViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericViewSet,
):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    lookup_field = "comment_id"

    # return comment's record
    @action(detail=True, methods=["get"])
    def record(self, request, comment_id=None):
        comment = self.get_object()
        serializer = RecordSerializer(comment.record_id, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)
