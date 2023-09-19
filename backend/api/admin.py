from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model

from .models import Comment, Record, Subsystem, Team

User = get_user_model()


# user admin
# ------------------------------------------------------------------------------
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {"fields": ["password"]}),
        (
            "Personal info",
            {"fields": ("first_name", "last_name", "username", "team", "email")},
        ),
    )

    list_display = [
        "first_name",
        "last_name",
        "team",
        "username",
        "email",
    ]
    search_fields = ["first_name", "last_name", "team", "username", "email"]


# team admin
# ------------------------------------------------------------------------------
@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ["team_name", "team_lead"]


# subsystem admin
# ------------------------------------------------------------------------------
@admin.register(Subsystem)
class SubsystemAdmin(admin.ModelAdmin):
    list_display = ["subsystem_name", "parent_team"]


# record admin
# ------------------------------------------------------------------------------
@admin.register(Record)
class RecordAdmin(admin.ModelAdmin):
    list_display = [
        "record_creation_time",
        "status",
        "team",
        "subsystem",
        "record_creator",
        "car_year",
    ]
    list_filter = [
        "record_creation_time",
        "status",
        "team",
        "subsystem",
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
