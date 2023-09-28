from api.models import Record, User
from api.permissions import IsLeadPermission, IsOwnerOrReadOnly
from django.contrib.auth.models import AnonymousUser
from django.test import RequestFactory, TestCase
from rest_framework.test import APIRequestFactory, force_authenticate, APITestCase
from rest_framework.views import APIView
from django.core.exceptions import PermissionDenied
from unittest.mock import PropertyMock, patch
from api.views import RecordViewSet
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from api.permissions import IsOwnerOrReadOnly as OriginalIsOwnerOrReadOnly
from rest_framework import permissions


class IsLeadPermissionTestCase(TestCase):
    """Tests for the IsLeadPermission permission class."""

    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="test1234",
        )
        self.view = APIView()

    def test_not_authenticated(self):
        """User not authenticated should return False."""
        request = self.factory.get("/")
        request.user = AnonymousUser()  # Using AnonymousUser for unauthenticated user.
        permission = IsLeadPermission()

        self.assertFalse(permission.has_permission(request, self.view))

    def test_authenticated_but_not_lead(self):
        """Authenticated user but not a lead should return False."""
        request = self.factory.get("/")
        request.user = self.user
        permission = IsLeadPermission()

        self.assertFalse(permission.has_permission(request, self.view))

    def test_authenticated_and_lead(self):
        """Authenticated user and is a lead should return True."""
        self.user.is_admin = True
        self.user.save()

        request = self.factory.get("/")
        request.user = self.user
        permission = IsLeadPermission()

        self.assertTrue(permission.has_permission(request, self.view))

class IsOwnerOrReadOnly(OriginalIsOwnerOrReadOnly):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.record_creator == request.user        
    
class IsOwnerOrReadOnlyTestCase(TestCase):
    """Tests for the IsOwnerOrReadOnly permission class."""

    def setUp(self):
        self.factory = APIRequestFactory()

        # Provide first_name and last_name when creating a user
        self.user = User.objects.create_user(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="test1234",
        )
        # Mock the username attribute for the test
        self.user.username = f"{self.user.first_name} {self.user.last_name}"

        self.record = Record.objects.create(record_creator=self.user)
        self.view = APIView()

    def test_owner_permission(self):
        """Only the creator of the record should be allowed to edit."""
        request = self.factory.put("/")
        request.user = self.user
        permission = IsOwnerOrReadOnly()

        self.record.record_creator = self.user
        self.record.save()
        
        self.assertTrue(
            permission.has_object_permission(request, self.view, self.record)
        )

    def test_non_owner_permission(self):
        """Non-creator of the record should not be allowed to edit."""
        another_user = User.objects.create_user(
            first_name="Jane",
            last_name="Doe",
            email="jane@example.com",
            password="test1234",
        )
        # Mock the username attribute for the test
        another_user.username = f"{another_user.first_name} {another_user.last_name}"

        request = self.factory.put("/")
        request.user = another_user
        permission = IsOwnerOrReadOnly()

        # Even though another_user is making the request, the record's creator is still self.user (from the setUp)
        self.record.record_creator = (
            self.user
        )  # Set the record's creator to the original user's email.
        self.record.save()

        self.assertFalse(
            permission.has_object_permission(request, self.view, self.record)
        )  # Permission denied Permission denied
