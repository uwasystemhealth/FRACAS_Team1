from django.conf import settings
from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import decorators, get_user_model

from .models import Category, Comment, Report, Subcategory, Team

User = get_user_model()


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


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ["team_name", "team_lead"]


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = [
        "report_creation_time",
        "status",
        "category",
        "subcategory",
        "report_creator",
        "car_year",
    ]
    list_filter = [
        "report_creation_time",
        "status",
        "category",
        "subcategory",
        "report_creator",
        "car_year",
    ]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["category_name"]


@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ["subcategory_name", "parent_category"]


@admin.register(Comment)
class CommentsAdmin(admin.ModelAdmin):
    list_display = [
        "comment_text",
        "commenter",
        "creation_time",
        "report_id",
    ]
    ordering = ["creation_time"]
    list_filter = ["creation_time", "commenter", "report_id"]
