from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Category, Comment, Record, Subcategory, Team, User

User = get_user_model()


# team serializer
# ------------------------------------------------------------------------------
class TeamSerializer(serializers.ModelSerializer):
    team_lead = serializers.StringRelatedField()
    url = serializers.HyperlinkedIdentityField(
        view_name="api:team-detail", lookup_field="team_name"
    )

    class Meta:
        model = Team
        fields = ["team_name", "team_lead", "url"]

    extra_kwargs = {
        "url": {"view_name": "api:team-detail", "lookup_field": "team_name"},
    }


# user serializer
# ------------------------------------------------------------------------------
class UserSerializer(serializers.ModelSerializer[User]):
    team = serializers.SlugRelatedField(slug_field="team_name", read_only=True)

    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email", "team", "url"]

        extra_kwargs = {
            "url": {"view_name": "api:user-detail", "lookup_field": "username"},
        }


# category serializer
# ------------------------------------------------------------------------------
class CategorySerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name="api:category-detail", lookup_field="category_name"
    )

    class Meta:
        model = Category
        fields = ["category_name", "url"]


# subcategory serializer
# ------------------------------------------------------------------------------
class SubcategorySerializer(serializers.ModelSerializer):
    parent_category = serializers.SlugRelatedField(
        slug_field="category_name", read_only=True
    )
    url = serializers.HyperlinkedIdentityField(
        view_name="api:subcategory-detail", lookup_field="subcategory_name"
    )

    class Meta:
        model = Subcategory
        fields = ["subcategory_name", "parent_category", "url"]


# record serializer
# ------------------------------------------------------------------------------
class RecordSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="category_name", read_only=True)
    subcategory = serializers.SlugRelatedField(
        slug_field="subcategory_name", read_only=True
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
    commenter = serializers.StringRelatedField()
    url = serializers.HyperlinkedIdentityField(
        view_name="api:comment-detail", lookup_field="comment_id"
    )

    class Meta:
        model = Comment
        fields = "__all__"
