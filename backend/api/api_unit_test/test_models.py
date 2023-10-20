from api.models import Comment, Record, Subsystem, Team, User
from django.test import TestCase
from django.utils import timezone


class CustomUserManagerTestCase(TestCase):
    """Tests for the CustomUserManager."""

    def test_create_user(self):
        """Test creating a user."""
        user = User.objects.create_user(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="test1234",
        )
        self.assertIsNotNone(user)
        self.assertEqual(user.first_name, "John")
        self.assertEqual(user.last_name, "Doe")
        self.assertTrue(user.check_password("test1234"))

    def test_create_superuser(self):
        """Test creating a superuser."""
        user = User.objects.create_superuser(
            first_name="Admin",
            last_name="User",
            email="admin@example.com",
            password="admin1234",
        )
        self.assertIsNotNone(user)
        self.assertTrue(user.is_admin)
        self.assertTrue(user.is_superuser)


class UserTestCase(TestCase):
    """Tests for the User model."""

    def setUp(self):
        self.user = User.objects.create_user(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="test1234",
        )

    def test_str_method(self):
        """Test __str__ method."""
        self.assertEqual(str(self.user), "John Doe")

    def test_is_admin_property(self):
        """Test is_staff property."""
        self.assertFalse(self.user.is_admin)
        self.user.is_admin = True
        self.assertTrue(self.user.is_admin)


class TeamTestCase(TestCase):
    """Tests for the Team model."""

    def setUp(self):
        self.team = Team.objects.create(team_name="Team A")

    def test_str_method(self):
        """Test __str__ method."""
        self.assertEqual(str(self.team), "Team A")


class SubsystemTestCase(TestCase):
    """Tests for the Subsystem model."""

    def setUp(self):
        self.team = Team.objects.create(team_name="Team A")
        self.subsystem = Subsystem.objects.create(
            subsystem_name="Subsystem A", parent_team=self.team
        )

    def test_str_method(self):
        """Test __str__ method."""
        self.assertEqual(str(self.subsystem), "Subsystem A")


class RecordTestCase(TestCase):
    """Tests for the Record model."""

    def setUp(self):
        self.record = Record.objects.create()

    def test_str_method(self):
        """Test __str__ method."""
        self.assertEqual(str(self.record), str(self.record.record_id))


class CommentTestCase(TestCase):
    """Tests for the Comment model."""

    def setUp(self):
        self.user = User.objects.create_user(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="test1234",
        )
        self.record = Record.objects.create()
        self.comment = Comment.objects.create(
            record_id=self.record, commenter=self.user, comment_text="Test comment."
        )

    def test_str_method(self):
        """Test __str__ method."""
        self.assertEqual(str(self.comment), str(self.comment.comment_id))
