from django.urls import reverse
from django.test import TestCase
from django.contrib.auth import get_user_model

from api.models import Comment, Record, Subsystem, Team

User = get_user_model()

class AdminSiteTest(TestCase):
    def setUp(self):
        # Create an admin user
        self.admin_user = User.objects.create_superuser(
            email='admin@test.com',
            password='password123',
            username='adminuser'
        )
        self.client.force_login(self.admin_user)

        # Create a regular user for further tests
        self.user = User.objects.create_user(
            email='user@test.com',
            password='password123',
            username='testuser'
        )

        # Create other model instances
        self.team = Team.objects.create(
            team_name="Test Team",
            team_lead=self.user
        )

        self.subsystem = Subsystem.objects.create(
            subsystem_name="Test Subsystem",
            parent_team=self.team
        )

        self.record = Record.objects.create(
            status="Test Status",
            team=self.team,
            subsystem=self.subsystem,
            record_creator=self.user,
            car_year=2023
        )

        self.comment = Comment.objects.create(
            comment_text="Test Comment",
            commenter=self.user,
            record_id=self.record
        )

    def test_users_listed(self):
        """Test that users are listed on user admin page"""
        url = reverse('admin:api_user_changelist')
        response = self.client.get(url)
        self.assertContains(response, self.user.username)
        self.assertContains(response, self.user.email)

    def test_teams_listed(self):
        """Test that teams are listed on team admin page"""
        url = reverse('admin:api_team_changelist')
        response = self.client.get(url)
        self.assertContains(response, self.team.team_name)
        self.assertContains(response, str(self.team.team_lead))

    def test_subsystems_listed(self):
        """Test that subsystems are listed on subsystem admin page"""
        url = reverse('admin:api_subsystem_changelist')
        response = self.client.get(url)
        self.assertContains(response, self.subsystem.subsystem_name)
        self.assertContains(response, str(self.subsystem.parent_team))

    # ... (rest of the code above)

    def test_records_listed(self):
        """Test that records are listed on record admin page"""
        url = reverse('admin:api_record_changelist')
        response = self.client.get(url)
        # Check only for the date portion of the record_creation_time
        self.assertContains(response, str(self.record.record_creation_time.date()))
        self.assertContains(response, self.record.status)
        self.assertContains(response, str(self.record.team))
        self.assertContains(response, str(self.record.subsystem))
        self.assertContains(response, str(self.record.record_creator))
        self.assertContains(response, str(self.record.car_year))

    def test_comments_listed(self):
        """Test that comments are listed on comment admin page"""
        url = reverse('admin:api_comment_changelist')
        response = self.client.get(url)
        self.assertContains(response, self.comment.comment_text)
        self.assertContains(response, str(self.comment.commenter))
        # Check only for the date portion of the creation_time
        self.assertContains(response, str(self.comment.creation_time.date()))
        self.assertContains(response, str(self.comment.record_id))

# ... you can expand this with more detailed tests as needed.


    # ... you can expand this with more detailed tests as needed.
