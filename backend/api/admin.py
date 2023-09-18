from django.conf import settings
from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model

from .models import Category, Comment, Record, Subcategory, Team

User = get_user_model()


# user admin
# ------------------------------------------------------------------------------
@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "team", "email")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    list_display = [
        "first_name",
        "last_name",
        "team",
        "username",
        "email",
        "is_superuser",
    ]
    search_fields = ["first_name", "last_name", "team", "username", "email"]


# team admin
# ------------------------------------------------------------------------------
@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ["team_name", "team_lead"]


# category admin
# ------------------------------------------------------------------------------
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["category_name"]


# subcategory admin
# ------------------------------------------------------------------------------
@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ["subcategory_name", "parent_category"]


# record admin
# ------------------------------------------------------------------------------
@admin.register(Record)
class RecordAdmin(admin.ModelAdmin):
    list_display = [
        "record_creation_time",
        "status",
        "category",
        "subcategory",
        "record_creator",
        "car_year",
    ]
    list_filter = [
        "record_creation_time",
        "status",
        "category",
        "subcategory",
        "record_creator",
        "car_year",
    ]


# comment admin
# ------------------------------------------------------------------------------
@admin.register(Comment)
class CommentsAdmin(admin.ModelAdmin):
    list_display = [
        "comment_text",
        "commenter",
        "creation_time",
        "record_id",
    ]
    ordering = ["creation_time"]
    list_filter = ["creation_time", "commenter", "record_id"]
