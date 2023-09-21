from django.contrib.auth import get_user_model, login, logout
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
)
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from .models import Comment, Record, Subsystem, Team
from .serializers import (
    CommentSerializer,
    RecordSerializer,
    SubsystemSerializer,
    TeamSerializer,
    UserLoginSerializer,
    UserRegisterSerializer,
    UserSerializer,
)
from .validations import register_validation, validate_email, validate_password

User = get_user_model()


class ReadOnlyPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS


# views
# register, login, logout views for sessionid authentication


class UserRegister(APIView):
    # permission_classes = (permissions.AllowAny,)

    def post(self, request):
        clean_data = register_validation(request.data)
        serializer = UserRegisterSerializer(data=clean_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(clean_data)
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    # permission_classes = (permissions.AllowAny,)
    # authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        assert validate_email(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user)
            return Response(serializer.data, status=status.HTTP_200_OK)


class UserLogout(APIView):
    # permission_classes = (permissions.AllowAny,)
    # authentication_classes = ()

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


# Viewsets
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
    lookup_field = "user_id"
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ["user_id", "email", "team__team_name"]
    filterset_fields = ["user_id", "email", "team__team_name"]
    ordering_fields = ["user_id"]

    # filter by user id
    # def get_queryset(self, *args, **kwargs):
    #     assert isinstance(self.request.user.id, int)
    #     return self.queryset.filter(id=self.request.user.id)

    # return current user
    @action(detail=False, methods=["get"], permission_classes=[ReadOnlyPermission])
    def me(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)


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
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ["team_name", "team_lead__user_id", "team_lead__email"]
    filterset_fields = ["team_name", "team_lead__user_id", "team_lead__email"]
    ordering_fields = ["team_name"]

    # return team members
    @action(detail=True, methods=["get"], permission_classes=[ReadOnlyPermission])
    def members(self, request, team_name=None):
        team = self.get_object()
        members = User.objects.filter(team=team)
        serializer = UserSerializer(members, many=True, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    # return team lead
    @action(detail=True, methods=["get"], permission_classes=[ReadOnlyPermission])
    def lead(self, request, team_name=None):
        team = self.get_object()
        lead = team.team_lead
        user = User.objects.filter(user_id=lead.user_id)
        serializer = UserSerializer(user, many=True, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    # return all subsystems in a team
    @action(detail=True, methods=["get"], permission_classes=[ReadOnlyPermission])
    def subsystems(self, request, team_name=None):
        team = self.get_object()
        subsystems = Subsystem.objects.filter(parent_team=team).order_by(
            "subsystem_name"
        )
        serializer = SubsystemSerializer(
            subsystems, many=True, context={"request": request}
        )
        return Response(status=status.HTTP_200_OK, data=serializer.data)


# Subsystem Viewset
# ------------------------------------------------------------------------------
class SubsystemViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericViewSet,
):
    serializer_class = SubsystemSerializer
    queryset = Subsystem.objects.all()
    lookup_field = "subsystem_name"
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ["subsystem_name", "parent_team__team_name"]
    filterset_fields = ["subsystem_name", "parent_team__team_name"]
    ordering_fields = ["subsystem_name"]

    # return subsystem's parent team
    @action(detail=True, methods=["get"], permission_classes=[ReadOnlyPermission])
    def parent(self, request, subsystem_name=None):
        subsystem = self.get_object()
        serializer = TeamSerializer(subsystem.parent_team, context={"request": request})
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
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = [
        "record_id",
        "team__team_name",
        "subsystem__subsystem_name",
        "record_creation_time",
        "status",
        "failure_title",
        "failure_description",
        "failure_impact",
        "failure_cause",
        "failure_mechanism",
        "corrective_action_plan",
        "team_lead",
        "car_year",
    ]
    filterset_fields = [
        "record_id",
        "team__team_name",
        "subsystem__subsystem_name",
        "status",
        "car_year",
    ]

    ordering_fields = ["record_creation_time"]

    # return all comments on a record
    @action(detail=True, methods=["get"], permission_classes=[ReadOnlyPermission])
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
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ["comment_text", "commenter__user_id"]
    filterset_fields = ["comment_text", "commenter__user_id"]
    ordering_fields = ["creation_time"]

    # return comment's record
    @action(detail=True, methods=["get"], permission_classes=[ReadOnlyPermission])
    def record(self, request, comment_id=None):
        comment = self.get_object()
        serializer = RecordSerializer(comment.record_id, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)
