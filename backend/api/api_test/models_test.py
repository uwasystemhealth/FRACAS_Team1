from django.test import TestCase
from django.contrib.auth import get_user_model
from api.models import Team, Subsystem, Record, Comment

User = get_user_model()

class CustomUserManagerTest(TestCase):

    def test_create_user(self):
        user = User.objects.create_user(username='testuser', email='test@test.com', password='testpass')
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@test.com')
        self.assertTrue(user.check_password('testpass'))

    def test_create_superuser(self):
        user = User.objects.create_superuser(username='admin', email='admin@admin.com', password='adminpass')
        self.assertEqual(user.username, 'admin')
        self.assertEqual(user.email, 'admin@admin.com')
        self.assertTrue(user.check_password('adminpass'))
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_admin)

class UserModelTest(TestCase):

    def setUp(self):
        # Create a user for testing
        self.user = User.objects.create_user(
            username='testuser',
            email='test@test.com',
            password='testpass'
        )

    def test_user_creation(self):
        """
        Test that user can be created and saved in the database
        """
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'test@test.com')
        self.assertFalse(self.user.is_admin)

    def test_user_string_representation_without_name(self):
        """
        Test string representation of user without first_name and last_name set
        """
        self.assertEqual(str(self.user), 'testuser')

    def test_user_string_representation_with_name(self):
        """
        Test string representation of user with first_name and last_name set
        """
        self.user.first_name = 'Test'
        self.user.last_name = 'User'
        self.user.save()

        self.assertEqual(str(self.user), 'Test User')

    def test_user_is_staff_property(self):
        """
        Test the is_staff property of the user
        """
        self.assertFalse(self.user.is_staff)
        self.user.is_admin = True
        self.user.save()

        self.assertTrue(self.user.is_staff)

class TeamModelTest(TestCase):

    def test_team_str(self):
        team = Team.objects.create(team_name='Test Team')
        self.assertEqual(str(team), 'Test Team')

class SubsystemModelTest(TestCase):

    def test_subsystem_str(self):
        subsystem = Subsystem.objects.create(subsystem_name='Test Subsystem')
        self.assertEqual(str(subsystem), 'Test Subsystem')

class RecordModelTest(TestCase):

    def test_record_str(self):
        record = Record.objects.create(status='Test Record')
        self.assertEqual(str(record), str(record.record_id))

class CommentModelTest(TestCase):

    def setUp(self):
        self.record = Record.objects.create(status='Test Record')
        
    def test_comment_str(self):
        comment = Comment.objects.create(record_id=self.record, comment_text='Test Comment')
        self.assertEqual(str(comment), str(comment.comment_id))
