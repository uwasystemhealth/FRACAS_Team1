from django.contrib.auth import get_user_model, login, logout
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
)
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from .models import Car, Comment, Record, Subsystem, Team
from .permissions import (
    IsCommenterOrAdmin,
    IsRecordCreatorOrAdmin,
    IsUserCreatorOrAdmin,
    ReadOnlyPermission,
)
from .serializers import (
    CarSerializer,
    CommentSerializer,
    RecordSerializer,
    SubsystemSerializer,
    TeamSerializer,
    UserRegisterSerializer,
    UserSerializer,
)
from .validations import register_validation

User = get_user_model()


# Pagination classes
class Pagination20(PageNumberPagination):
    page_size = 20


# API views
# ------------------------------------------------------------------------------
class UserRegister(APIView):
    """View to register a new user."""

    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        clean_data = register_validation(request.data)
        serializer = UserRegisterSerializer(data=clean_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(clean_data)
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


# class UserLogin(APIView):
# View is now using views.obtain_auth_token in urls.py


class UserLogout(APIView):
    """View to logout a user."""

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        token, created = Token.objects.get_or_create(user=request.user)
        token.delete()
        return Response({"message": "Logged out successfully"})


# Viewsets
# (XYZModelMixin can be used for CRUD functionality)


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
    """Viewset for the User model."""

    permission_classes = [IsUserCreatorOrAdmin]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = "user_id"
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ["user_id", "email", "team__team_name"]
    filterset_fields = ["user_id", "email", "team__team_name"]
    ordering_fields = ["user_id"]

    @action(detail=False, methods=["get"], permission_classes=[ReadOnlyPermission])
    def me(self, request):
        """additional API route to return current user"""
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
    """Viewset for the Team model."""

    permission_classes = [ReadOnlyPermission]
    serializer_class = TeamSerializer
    queryset = Team.objects.all()
    lookup_field = "team_name"
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ["team_name", "team_lead__user_id", "team_lead__email"]
    filterset_fields = ["team_name", "team_lead__user_id", "team_lead__email"]
    ordering_fields = ["team_name"]

    @action(detail=True, methods=["get"], permission_classes=[ReadOnlyPermission])
    def members(self, request, team_name=None):
        "additional API route to return team members"
        team = self.get_object()
        members = User.objects.filter(team=team)
        serializer = UserSerializer(members, many=True, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(detail=True, methods=["get"], permission_classes=[ReadOnlyPermission])
    def lead(self, request, team_name=None):
        """additional API route to return team lead"""
        team = self.get_object()
        lead = team.team_lead
        user = User.objects.filter(user_id=lead.user_id)
        serializer = UserSerializer(user, many=True, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(detail=True, methods=["get"], permission_classes=[ReadOnlyPermission])
    def subsystems(self, request, team_name=None):
        """additional API route to return all subsystems in a team"""
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
    """Viewset for the Subsystem model."""

    permission_classes = [ReadOnlyPermission]
    serializer_class = SubsystemSerializer
    queryset = Subsystem.objects.all()
    lookup_field = "subsystem_name"
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ["subsystem_name", "parent_team__team_name"]
    filterset_fields = ["subsystem_name", "parent_team__team_name"]
    ordering_fields = ["subsystem_name"]

    @action(detail=True, methods=["get"], permission_classes=[ReadOnlyPermission])
    def parent(self, request, subsystem_name=None):
        """additional API route to return subsystem's parent team"""
        subsystem = self.get_object()
        serializer = TeamSerializer(subsystem.parent_team, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)


# Car Viewset
# ------------------------------------------------------------------------------
class CarViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericViewSet,
):
    """Viewset for the Car model."""

    permission_classes = [ReadOnlyPermission]
    serializer_class = CarSerializer
    queryset = Car.objects.all()
    lookup_field = "car_year"
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ["car_year", "car_nickname"]
    filterset_fields = ["car_year", "car_nickname"]
    ordering_fields = ["car_year"]

    @action(detail=False, methods=["get"], permission_classes=[ReadOnlyPermission])
    def current(self, request):
        """additional API route to return highest car year as current car"""
        car = Car.objects.order_by("-car_year").first()
        serializer = CarSerializer(car, context={"request": request})
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
    """Viewset for the Record model."""

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsRecordCreatorOrAdmin]
    serializer_class = RecordSerializer
    pagination_class = Pagination20
    queryset = Record.objects.all()
    lookup_field = "record_id"
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = [
        "record_id",
        "record_creator__user_id",
        "record_creator_unlinked",
        "record_owner__user_id",
        "record_owner_unlinked",
        "team__team_name",
        "team_unlinked",
        "subsystem__subsystem_name",
        "subsystem_unlinked",
        "record_creation_time",
        "status",
        "failure_title",
        "failure_description",
        "failure_impact",
        "failure_cause",
        "failure_mechanism",
        "corrective_action_plan",
        "team_lead",
        "car_year__car_year",
        "car_year__car_nickname",
    ]
    filterset_fields = [
        "record_id",
        "record_creator__user_id",
        "record_creator_unlinked",
        "record_owner__user_id",
        "record_owner_unlinked",
        "team__team_name",
        "team_unlinked",
        "subsystem__subsystem_name",
        "subsystem_unlinked",
        "record_creation_time",
        "status",
        "car_year__car_year",
        "car_year__car_nickname",
    ]

    ordering_fields = ["record_creation_time"]

    @action(detail=False, methods=["get"], permission_classes=[ReadOnlyPermission])
    def comments(self, request, record_id=None):
        """additional API route to return all comments on a record"""
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
    """Viewset for the Comment model."""

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsCommenterOrAdmin]
    serializer_class = CommentSerializer
    pagination_class = Pagination20
    queryset = Comment.objects.all()
    lookup_field = "comment_id"
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ["comment_text", "commenter__user_id"]
    filterset_fields = ["comment_text", "commenter__user_id"]
    ordering_fields = ["creation_time"]

    @action(detail=True, methods=["get"], permission_classes=[ReadOnlyPermission])
    def record(self, request, comment_id=None):
        """additional API route to return comment's record"""
        comment = self.get_object()
        serializer = RecordSerializer(comment.record_id, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)
