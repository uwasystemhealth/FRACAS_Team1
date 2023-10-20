from api.models import Comment, Record, Subsystem, Team, User
from django.test import TestCase
from api.serializers import (
    CommentSerializer,
    RecordSerializer,
    SubsystemSerializer,
    TeamSerializer,
    UserSerializer,
)
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase, force_authenticate
from rest_framework.authtoken.models import Token
from django.test import override_settings
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status


User = get_user_model()


class UserTestCase(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(team_name="Test Team")
        self.user = User.objects.create_user(
            email="testuser@example.com",
            password="password",
            first_name="Test",
            last_name="User",
            team=self.team,
        )
        self.subsystem = Subsystem.objects.create(
            subsystem_name="Test Subsystem", parent_team=self.team
        )
        self.record = Record.objects.create(
            record_id="1", team=self.team, subsystem=self.subsystem
        )
        self.comment = Comment.objects.create(
            comment_id="1", record_id=self.record, commenter=self.user
        )


    def test_user_logout(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("api:logout")
        response = self.client.post(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class UserViewSetTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="test1234",
        )
        self.client.force_authenticate(user=self.user)

    def test_create_user(self):
        url = reverse("api:user-list")
        data = {
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "jane.doe@example.com",
            "password": "test1234",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_user(self):
        url = reverse("api:user-detail", kwargs={"user_id": self.user.user_id})
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_users(self):
        url = reverse("api:user-list")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_user(self):
        url = reverse("api:user-detail", kwargs={"user_id": self.user.user_id})
        data = {
            "first_name": "Johnny",
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_user(self):
        url = reverse("api:user-detail", kwargs={"user_id": self.user.user_id})
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_viewset_me(self):
        url = reverse("api:user-me")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            UserSerializer(self.user, context={"request": response.wsgi_request}).data,
        )


class TeamViewSetTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        # First, create the team
        self.team = Team.objects.create(
            team_name='Test Team',
        )
        # Now, create the team_lead and assign the previously created team to it
        self.team_lead = User.objects.create_user(
            email="testuser@example.com",
            password="password",
            first_name="Test",
            last_name="User",
            team=self.team,  # Now self.team is already defined
        )
        # Adjust the team object to include the team lead
        self.team.team_lead = self.team_lead
        self.team.save()
        
        self.valid_payload = {
            'team_name': 'New Team',
            'team_lead': User.objects.create_user(
                email="newteamlead@example.com",
                password="password",
                first_name="New",
                last_name="TeamLead"
            ).pk,
        }
        self.superuser = User.objects.create_superuser(
            email='superuser@example.com',
            password='password',
            first_name='Super',
            last_name='User'
        )

        
        token, created = Token.objects.get_or_create(user=self.superuser)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

    def test_list_teams(self):
        url = reverse('api:team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_team(self):
        url = reverse('api:team-list')
        response = self.client.post(url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_team(self):
        url = reverse('api:team-detail', kwargs={'team_name': self.team.team_name})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_team(self):
        url = reverse('api:team-detail', kwargs={'team_name': self.team.team_name})
        response = self.client.put(url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_destroy_team(self):
        url = reverse('api:team-detail', kwargs={'team_name': self.team.team_name})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_members(self):
        url = reverse('api:team-members', kwargs={'team_name': self.team.team_name})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_lead(self):
        url = reverse('api:team-lead', kwargs={'team_name': self.team.team_name})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_subsystems(self):
        url = reverse('api:team-subsystems', kwargs={'team_name': self.team.team_name})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
@override_settings(DEFAULT_AUTHENTICATION_CLASSES=[])
class SubsystemViewSetTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="test1234",
        )
        self.team = Team.objects.create(team_name="Test Team", team_lead=self.user)
        self.subsystem = Subsystem.objects.create(
            subsystem_name="Test Subsystem",
            parent_team=self.team,
        )
        # Manually create a token for the user
        self.token = Token.objects.create(user=self.user)
        
        self.client.force_authenticate(user=None) 

    def test_create_subsystem_without_authentication(self):
        url = reverse('api:subsystem-list')
        data = {
            "subsystem_name": "New Subsystem",
            "parent_team": self.team.team_name
        }
        self.client.logout()  # Log the user out to simulate unauthenticated request
        response = self.client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)



    def test_update_subsystem_without_authentication(self):
        url = reverse("api:subsystem-detail", kwargs={"subsystem_name": self.subsystem.subsystem_name})
        data = {
            "subsystem_name": "Updated Subsystem Name",
        }
        self.client.logout()  # Log the user out to simulate unauthenticated request
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Verify that the subsystem was not updated
        self.subsystem.refresh_from_db()
        self.assertEqual(self.subsystem.subsystem_name, "Test Subsystem")

    def test_delete_subsystem_without_authentication(self):
        url = reverse("api:subsystem-detail", kwargs={"subsystem_name": self.subsystem.subsystem_name})
        self.client.logout()  # Log the user out to simulate unauthenticated request
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Verify that the subsystem was not deleted
        self.assertEqual(Subsystem.objects.count(), 1)

    

class RecordViewSetTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="test1234",
        )
        self.team = Team.objects.create(team_name="Test Team", team_lead=self.user)
        self.subsystem = Subsystem.objects.create(
            subsystem_name="Test Subsystem",
            parent_team=self.team,
        )
        self.record = Record.objects.create(
            # ... other required fields,
            subsystem=self.subsystem,
            team=self.team,
        )
        self.test_user = User.objects.create_user(
            first_name="Test",
            last_name="User",
            email="test@example.com",
            password="testpassword",
        )
        # Assign necessary permissions to test_user
        self.record.record_creator = self.test_user
        self.record.save()
        self.client.force_authenticate(user=self.test_user) 

    @override_settings(DRF_DEFAULT_PERMISSION_CLASSES=['rest_framework.permissions.AllowAny'])
    def test_create_record(self):
        # Test creating a record without permission checks
        url = reverse('api:record-list')
        data = {
            # ... your record data,
            "subsystem": self.subsystem.subsystem_name,
            "team": self.team.team_name,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_record(self):
        url = reverse("api:record-detail", kwargs={"record_id": self.record.record_id})
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_records(self):
        url = reverse("api:record-list")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_record(self):
        url = reverse("api:record-detail", kwargs={"record_id": self.record.record_id})
        data = {
            # ... updated record data,
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_record(self):
        url = reverse("api:record-detail", kwargs={"record_id": self.record.record_id})
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class CommentViewSetTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.team = Team.objects.create(team_name="Test Team")
        self.subsystem = Subsystem.objects.create(
            subsystem_name="Test Subsystem", parent_team=self.team
        )
        
        self.user = User.objects.create_user(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="test1234",
        )
        
        self.record = Record.objects.create(
            team=self.team,
            subsystem=self.subsystem,
            record_creator=self.user,  # Pass User instance instead of string
            record_owner=self.user,
            failure_title="Test Failure Title",
            failure_description="Test Failure Description",
            # ... Other fields
        )
    
        self.comment = Comment.objects.create(
            record_id=self.record, commenter=self.user, comment_text="Test Comment"
        )
        
        self.client.force_authenticate(user=self.user) 

    def test_create_comment(self):
        url = reverse("api:comment-list")
        data = {
            "record_id": self.record.record_id,
            "commenter": self.user.user_id,  # Assuming User model has a user_id field
            "comment_text": "New comment text",
        }
        response = self.client.post(url, data, format="json")
        self.client.logout()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_comment(self):
        url = reverse(
            "api:comment-detail", kwargs={"comment_id": self.comment.comment_id}
        )
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_comment_record(self):
        url = reverse(
            "api:comment-record"
        )
        response = self.client.get(url,{"record_id": self.record.pk}, format="json")
        self.assertEqual(response.status_code,  status.HTTP_200_OK)
        expected_data = CommentSerializer(
            self.comment, context={"request": response.wsgi_request}
        ).data
        print(expected_data)
        self.assertEqual(response.data[0], expected_data)
