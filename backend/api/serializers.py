from django.contrib.auth import authenticate, get_user_model
from django.core.exceptions import ValidationError
from djoser.serializers import UserCreateSerializer
from rest_framework import serializers

from .models import Car, Comment, Record, Subsystem, Team
from .validations import register_validation

User = get_user_model()


# user serializer
# ------------------------------------------------------------------------------
class UserSerializer(serializers.ModelSerializer[User]):
    """Serializes the User model."""

    team = serializers.SlugRelatedField(
        slug_field="team_name",
        queryset=Team.objects.all(),
        allow_null=True,
        required=False,
    )

    class Meta:
        model = User
        slugfield = "user_id"
        fields = [
            "user_id",
            "first_name",
            "last_name",
            "email",
            "team",
            "url",
            "is_admin",
            "is_staff",
        ]

        extra_kwargs = {
            "url": {"view_name": "api:user-detail", "lookup_field": "user_id"},
        }


class UserRegistrationSerializer(UserCreateSerializer):
    """Serializes the User model for Registration."""

    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    team = serializers.SlugRelatedField(
        slug_field="team_name",
        queryset=Team.objects.all(),
        allow_null=True,
        required=False,
    )

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = (
            "email",
            "first_name",
            "last_name",
            "team",
            "password",
            "password2",
        )

    def validate(self, data):
        # this removes password2 if validations pass before sending to the model
        validated_data = register_validation(data)
        return super().validate(validated_data)


class UserLoginSerializer(serializers.Serializer):
    """Serializes the User model for login."""

    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, clean_data):
        """Authenticates the user with the provided clean_data.

        Args:
            clean_data (dict): A dictionary containing the cleaned data.

        Returns:
            User: The authenticated user instance.

        Raises:
            ValidationError: If the user is not found.
        """
        user = authenticate(
            username=clean_data["email"], password=clean_data["password"]
        )
        if not user:
            raise ValidationError("user not found")
        return user


# team serializer
# ------------------------------------------------------------------------------
class TeamSerializer(serializers.ModelSerializer):
    """Serializes the Team model."""

    team_lead = serializers.SlugRelatedField(
        slug_field="user_id",
        queryset=User.objects.all(),
        allow_null=True,
        required=False,
    )
    url = serializers.HyperlinkedIdentityField(
        view_name="api:team-detail", lookup_field="team_name"
    )

    class Meta:
        model = Team
        slugfield = "team_name"
        fields = ["team_name", "team_lead", "url"]

    extra_kwargs = {
        "url": {"view_name": "api:team-detail", "lookup_field": "team_name"},
    }


# subsystem serializer
# ------------------------------------------------------------------------------
class SubsystemSerializer(serializers.ModelSerializer):
    """Serializes the Subsystem model."""

    parent_team = serializers.SlugRelatedField(
        slug_field="team_name",
        queryset=Team.objects.all(),
        allow_null=True,
        required=False,
    )
    url = serializers.HyperlinkedIdentityField(
        view_name="api:subsystem-detail", lookup_field="subsystem_name"
    )

    class Meta:
        model = Subsystem
        slug_field = "subsystem_name"
        fields = ["subsystem_name", "parent_team", "url"]


# car serializer
# ------------------------------------------------------------------------------
class CarSerializer(serializers.ModelSerializer):
    """Serializes the Car model."""

    url = serializers.HyperlinkedIdentityField(
        view_name="api:car-detail", lookup_field="car_year"
    )

    class Meta:
        model = Car
        slug_field = "car_year"
        fields = ["car_year", "car_nickname", "url"]


# record serializer
# ------------------------------------------------------------------------------
class RecordSerializer(serializers.ModelSerializer):
    """Serializes the Record model."""

    record_creator = serializers.SlugRelatedField(
        slug_field="user_id",
        queryset=User.objects.all(),
        allow_null=True,
        required=False,
    )
    record_owner = serializers.SlugRelatedField(
        slug_field="user_id",
        queryset=User.objects.all(),
        allow_null=True,
        required=False,
    )
    team = serializers.SlugRelatedField(
        slug_field="team_name",
        queryset=Team.objects.all(),
        allow_null=True,
        required=False,
    )
    subsystem = serializers.SlugRelatedField(
        slug_field="subsystem_name",
        queryset=Subsystem.objects.all(),
        allow_null=True,
        required=False,
    )
    car_year = serializers.SlugRelatedField(
        slug_field="car_year",
        queryset=Car.objects.all(),
        allow_null=True,
        required=False,
    )
    url = serializers.HyperlinkedIdentityField(
        view_name="api:record-detail", lookup_field="record_id"
    )

    class Meta:
        model = Record
        SlugField = "record_id"
        fields = "__all__"


# comment serializer
# ------------------------------------------------------------------------------
class CommentSerializer(serializers.ModelSerializer):
    """Serializes the Comment model."""

    commenter = serializers.SlugRelatedField(
        slug_field="user_id",
        queryset=User.objects.all(),
        allow_null=True,
        required=False,
    )
    url = serializers.HyperlinkedIdentityField(
        view_name="api:comment-detail", lookup_field="comment_id"
    )

    class Meta:
        model = Comment
        slug_field = "comment_id"
        fields = "__all__"
