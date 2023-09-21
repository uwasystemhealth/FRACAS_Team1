from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

from .models import Comment, Record, Subsystem, Team

User = get_user_model()


# user serializer
# ------------------------------------------------------------------------------
class UserSerializer(serializers.ModelSerializer[User]):
    team = serializers.SlugRelatedField(
        slug_field="team_name",
        queryset=Team.objects.all(),
        allow_null=True,
        required=False,
    )

    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email", "team", "url"]

        extra_kwargs = {
            "url": {"view_name": "api:user-detail", "lookup_field": "username"},
        }


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

    def create(self, clean_data):
        user_data = clean_data.copy()
        team = user_data["team"]
        if team is not None:
            user_data["team"] = Team.objects.get(pk=clean_data["team"])
        else:
            user_data["team"] = None

        user_obj = User.objects.create_user(**user_data)

        user_obj.username = clean_data["username"]
        user_obj.save()
        return user_obj


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, clean_data):
        user = authenticate(
            username=clean_data["email"], password=clean_data["password"]
        )
        if not user:
            raise ValidationError("user not found")
        return user


# team serializer
# ------------------------------------------------------------------------------
class TeamSerializer(serializers.ModelSerializer):
    team_lead = serializers.SlugRelatedField(
        slug_field="username",
        queryset=User.objects.all(),
        allow_null=True,
        required=False,
    )
    url = serializers.HyperlinkedIdentityField(
        view_name="api:team-detail", lookup_field="team_name"
    )

    class Meta:
        model = Team
        fields = ["team_name", "team_lead", "url"]

    extra_kwargs = {
        "url": {"view_name": "api:team-detail", "lookup_field": "team_name"},
    }


# subsystem serializer
# ------------------------------------------------------------------------------
class SubsystemSerializer(serializers.ModelSerializer):
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


# record serializer
# ------------------------------------------------------------------------------
class RecordSerializer(serializers.ModelSerializer):
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
    url = serializers.HyperlinkedIdentityField(
        view_name="api:record-detail", lookup_field="record_id"
    )

    class Meta:
        model = Record
        fields = "__all__"


# comment serializer
# ------------------------------------------------------------------------------
class CommentSerializer(serializers.ModelSerializer):
    commenter = serializers.SlugRelatedField(
        slug_field="username",
        queryset=User.objects.all(),
        allow_null=True,
        required=False,
    )
    url = serializers.HyperlinkedIdentityField(
        view_name="api:comment-detail", lookup_field="comment_id"
    )

    class Meta:
        model = Comment
        fields = "__all__"
