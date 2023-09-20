from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Comment, Record, Subsystem, Team, User

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
        slug_field="subsystem_name", queryset=Subsystem.objects.all()
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
