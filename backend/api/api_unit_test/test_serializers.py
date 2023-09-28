import json

from api.models import Comment, Record, Subsystem, Team, User
from api.serializers import (
    CommentSerializer,
    RecordSerializer,
    SubsystemSerializer,
    TeamSerializer,
    UserSerializer,
)
from django.test import TestCase
from rest_framework.test import APIRequestFactory


class UserSerializerTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        request = self.factory.get("/")

        self.user_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
        }
        self.user = User.objects.create(**self.user_data)
        self.serializer = UserSerializer(
            instance=self.user, context={"request": request}
        )

    def test_valid_serialization(self):
        data = self.serializer.data
        self.assertEqual(data["first_name"], self.user_data["first_name"])
        # ... other field assertions


class TeamSerializerTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        request = self.factory.get("/")
        self.team_data = {
            "team_name": "Engineering",
            # ... other field data
        }
        self.team = Team.objects.create(**self.team_data)
        self.serializer = TeamSerializer(
            instance=self.team, context={"request": request}
        )

    def test_valid_serialization(self):
        data = self.serializer.data
        self.assertEqual(data["team_name"], self.team_data["team_name"])
        # ... other field assertions


class SubsystemSerializerTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        request = self.factory.get("/")
        self.subsystem_data = {
            "subsystem_name": "Propulsion",
            # ... other field data
        }
        self.subsystem = Subsystem.objects.create(**self.subsystem_data)
        self.serializer = SubsystemSerializer(
            instance=self.subsystem, context={"request": request}
        )

    def test_valid_serialization(self):
        data = self.serializer.data
        self.assertEqual(data["subsystem_name"], self.subsystem_data["subsystem_name"])
        # ... other field assertions


class RecordSerializerTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        request = self.factory.get("/")
        self.record_data = {
            "status": "Open",
            # ... other field data
        }
        self.record = Record.objects.create(**self.record_data)
        self.serializer = RecordSerializer(
            instance=self.record, context={"request": request}
        )

    def test_valid_serialization(self):
        data = self.serializer.data
        self.assertEqual(data["status"], self.record_data["status"])
        # ... other field assertions


class CommentSerializerTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        request = self.factory.get("/")
        self.user = User.objects.create(
            email="user@example.com", first_name="John", last_name="Doe"
        )  # Assume User model is already created.
        self.record = Record.objects.create(
            status="Open",
            # ... other necessary field data
        )
        self.comment_data = {
            "comment_text": "This is a comment.",
            "record_id": self.record,
            "commenter": self.user,  # assuming commenter is required
        }
        self.comment = Comment.objects.create(**self.comment_data)
        self.serializer = CommentSerializer(
            instance=self.comment, context={"request": request}
        )

    def test_valid_serialization(self):
        data = self.serializer.data
        self.assertEqual(data["comment_text"], self.comment_data["comment_text"])
        # ... other field assertions


# ... other test classes and methods as needed
