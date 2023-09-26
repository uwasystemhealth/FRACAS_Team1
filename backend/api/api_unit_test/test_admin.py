from django.test import TestCase
from django.contrib.admin.sites import AdminSite
from api.models import User, Team, Subsystem, Record, Comment
from api.admin import UserAdmin, TeamAdmin, SubsystemAdmin, RecordAdmin, CommentsAdmin

class MockRequest:
    pass

request = MockRequest()

class UserAdminTest(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.admin = UserAdmin(User, self.site)

    def test_user_admin_list_display(self):
        self.assertEqual(
            list(self.admin.list_display),
            ["first_name", "last_name", "team", "email", "is_admin"]
        )

    def test_user_admin_ordering(self):
        self.assertEqual(
            list(self.admin.ordering),
            ["first_name", "last_name", "team", "email", "is_admin"]
        )

    def test_user_admin_search_fields(self):
        self.assertEqual(
            list(self.admin.search_fields),
            ["first_name", "last_name", "team", "email"]
        )


class TeamAdminTest(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.admin = TeamAdmin(Team, self.site)

    def test_team_admin_list_display(self):
        self.assertEqual(
            list(self.admin.list_display),
            ["team_name", "team_lead"]
        )

    def test_team_admin_search_fields(self):
        self.assertEqual(
            list(self.admin.search_fields),
            ["team_name", "team_lead__user_id", "team_lead__email"]
        )


class SubsystemAdminTest(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.admin = SubsystemAdmin(Subsystem, self.site)

    def test_subsystem_admin_list_display(self):
        self.assertEqual(
            list(self.admin.list_display),
            ["subsystem_name", "parent_team"]
        )


class RecordAdminTest(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.admin = RecordAdmin(Record, self.site)

    def test_record_admin_list_display(self):
        self.assertEqual(
            list(self.admin.list_display),
            ["record_creation_time", "status", "team", "subsystem", "record_creator", "car_year"]
        )

    def test_record_admin_list_filter(self):
        self.assertEqual(
            list(self.admin.list_filter),
            ["record_creation_time", "status", "team", "subsystem", "record_creator", "car_year"]
        )


class CommentsAdminTest(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.admin = CommentsAdmin(Comment, self.site)

    def test_comments_admin_list_display(self):
        self.assertEqual(
            list(self.admin.list_display),
            ["comment_text", "commenter", "creation_time", "record_id"]
        )

    def test_comments_admin_ordering(self):
        self.assertEqual(
            list(self.admin.ordering),
            ["creation_time"]
        )

    def test_comments_admin_list_filter(self):
        self.assertEqual(
            list(self.admin.list_filter),
            ["creation_time", "commenter", "record_id"]
        )
