from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import *

User = get_user_model()


# user serializer
# ------------------------------------------------------------------------------
class UserSerializer(serializers.ModelSerializer[User]):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email", "team", "url"]

        extra_kwargs = {
            "url": {"view_name": "api:user-detail", "lookup_field": "username"},
        }


# team serializer
# ------------------------------------------------------------------------------
class TeamSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name="api:team-detail", lookup_field="team_name"
    )

    class Meta:
        model = Team
        fields = ["team_name", "team_lead", "url"]

    extra_kwargs = {
        "url": {"view_name": "api:team-detail", "lookup_field": "team_name"},
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
    url = serializers.HyperlinkedIdentityField(
        view_name="api:subcategory-detail", lookup_field="subcategory_name"
    )

    class Meta:
        model = Subcategory
        fields = ["subcategory_name", "url"]


# record serializer
# ------------------------------------------------------------------------------
class RecordSerializer(serializers.ModelSerializer):
    # url = serializers.HyperlinkedIdentityField(
    #     view_name="api:record-detail", lookup_field="record_id"
    # )

    class Meta:
        model = Record
        fields = "__all__"


# comment serializer
# ------------------------------------------------------------------------------
class CommentSerializer(serializers.ModelSerializer):
    # url = serializers.HyperlinkedIdentityField(
    #     view_name="api:comment-detail", lookup_field="comment_id"
    # )

    class Meta:
        model = Comment
        fields = "__all__"
