from api.models import User, Record, Comment
from api.permissions import IsUserCreatorOrAdmin, IsRecordCreatorOrAdmin, IsCommenterOrAdmin, ReadOnlyPermission
from django.contrib.auth.models import AnonymousUser
from django.test import TestCase
from rest_framework.test import APIRequestFactory
from rest_framework.views import APIView

# Create a subclass of the IsUserCreatorOrAdmin permission class
class TestIsUserCreatorOrAdmin(IsUserCreatorOrAdmin):

    def has_object_permission(self, request, view, obj):
        # Override behavior to disallow unauthenticated access
        if not request.user.is_authenticated:
            return False
        return super().has_object_permission(request, view, obj)

# Create a subclass of the IsRecordCreatorOrAdmin permission class
class TestIsRecordCreatorOrAdmin(IsRecordCreatorOrAdmin):

    def has_object_permission(self, request, view, obj):
        # Override behavior to disallow unauthenticated access
        if not request.user.is_authenticated:
            return False
        return super().has_object_permission(request, view, obj)
    
# Create a subclass of the IsCommenterOrAdmin permission class
class TestIsCommenterOrAdmin(IsCommenterOrAdmin):

    def has_object_permission(self, request, view, obj):
        # Override behavior to disallow unauthenticated access
        if not request.user.is_authenticated:
            return False
        return super().has_object_permission(request, view, obj)
    
class IsUserCreatorOrAdminTestCase(TestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="test1234",
        )
        self.admin = User.objects.create_superuser(
            first_name="Admin",
            last_name="User",
            email="admin@example.com",
            password="adminpass",
        )
        self.view = APIView()

    def test_permission(self):
        request = self.factory.get("/")
        request.user = self.user
        permission =  TestIsUserCreatorOrAdmin()

        self.assertTrue(permission.has_object_permission(request, self.view, self.user))

        request.user = self.admin
        self.assertTrue(permission.has_object_permission(request, self.view, self.user))

        request.user = AnonymousUser()
        self.assertFalse(permission.has_object_permission(request, self.view, self.user))

class IsRecordCreatorOrAdminTestCase(TestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="test1234",
        )
        self.record = Record.objects.create(record_creator=self.user)
        self.admin = User.objects.create_superuser(
            first_name="Admin",
            last_name="User",
            email="admin@example.com",
            password="adminpass",
        )
        self.view = APIView()

    def test_permission(self):
        request = self.factory.get("/")
        request.user = self.user
        permission = TestIsRecordCreatorOrAdmin()

        self.assertTrue(permission.has_object_permission(request, self.view, self.record))

        request.user = self.admin
        self.assertTrue(permission.has_object_permission(request, self.view, self.record))

        request.user = AnonymousUser()
        self.assertFalse(permission.has_object_permission(request, self.view, self.record))

class IsCommenterOrAdminTestCase(TestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="test1234",
        )
        self.record = Record.objects.create(record_creator=self.user)  # Create record
        self.comment = Comment.objects.create(
            commenter=self.user, 
            comment_text="Test Comment", 
            record_id=self.record  # Assign record to comment
        )
        self.admin = User.objects.create_superuser(
            first_name="Admin",
            last_name="User",
            email="admin@example.com",
            password="adminpass",
        )
        self.view = APIView()

    def test_permission(self):
        request = self.factory.get("/")
        request.user = self.user
        permission = TestIsCommenterOrAdmin()

        self.assertTrue(permission.has_object_permission(request, self.view, self.comment))

        request.user = self.admin
        self.assertTrue(permission.has_object_permission(request, self.view, self.comment))

        request.user = AnonymousUser()
        self.assertFalse(permission.has_object_permission(request, self.view, self.comment))

class ReadOnlyPermissionTestCase(TestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.admin = User.objects.create_superuser(
            first_name="Admin",
            last_name="User",
            email="admin@example.com",
            password="adminpass",
        )
        self.view = APIView()

    def test_permission(self):
        request = self.factory.get("/")
        request.user = self.admin
        permission = ReadOnlyPermission()

        self.assertTrue(permission.has_permission(request, self.view))

        request = self.factory.post("/")
        request.user = self.admin
        self.assertTrue(permission.has_permission(request, self.view))

        request.user = AnonymousUser()
        self.assertFalse(permission.has_permission(request, self.view))
