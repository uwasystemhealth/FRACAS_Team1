from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from api.models import Team, Subsystem, Record, Comment
from rest_framework.test import force_authenticate 
from api.serializers import UserSerializer, TeamSerializer, SubsystemSerializer, RecordSerializer, CommentSerializer

User = get_user_model()

class YourAppTestCase(APITestCase):

    def setUp(self):
        self.team = Team.objects.create(team_name='Test Team')
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='password',
            first_name='Test',
            last_name='User',
            team=self.team
        )
        self.subsystem = Subsystem.objects.create(subsystem_name='Test Subsystem', parent_team=self.team)
        self.record = Record.objects.create(record_id='1', team=self.team, subsystem=self.subsystem)
        self.comment = Comment.objects.create(comment_id='1', record_id=self.record, commenter=self.user)

    def test_user_register(self):
        url = reverse('api:register')
        data = {
            'email': 'newuser@example.com',
            'password1': 'password123',  # updated field name to password1
            'password2': 'password123',  # confirm password field
            'first_name': 'New',
            'last_name': 'User',
            'team': self.team.team_name  # updated to use team_name instead of team_id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)


    def test_user_login(self):
        url = reverse('api:login')  # updated
        data = {
            'email': 'testuser@example.com',
            'password': 'password'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_user_logout(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('api:logout')
        response = self.client.post(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
class UserViewSetTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            first_name='John', 
            last_name='Doe', 
            email='john@example.com', 
            password='test1234'
        )
        self.client.force_authenticate(user=self.user)

    def test_create_user(self):
        url = reverse('api:user-list')
        data = {
            'first_name': 'Jane',
            'last_name': 'Doe',
            'email': 'jane.doe@example.com',
            'password': 'test1234'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_user(self):
        url = reverse('api:user-detail', kwargs={'user_id': self.user.user_id})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_users(self):
        url = reverse('api:user-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_user(self):
        url = reverse('api:user-detail', kwargs={'user_id': self.user.user_id})
        data = {
            'first_name': 'Johnny',
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_user(self):
        url = reverse('api:user-detail', kwargs={'user_id': self.user.user_id})
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_viewset_me(self):
        url = reverse('api:user-me')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, UserSerializer(self.user, context={'request': response.wsgi_request}).data)

class TeamViewSetTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            first_name='John', 
            last_name='Doe', 
            email='john@example.com', 
            password='test1234'
        )
        self.team = Team.objects.create(
            team_name='Test Team',
            team_lead=self.user
        )
        self.subsystem = Subsystem.objects.create(
            subsystem_name='Test Subsystem',
            parent_team=self.team
        )
        self.client.force_authenticate(user=self.user)

    def test_create_team(self):
        url = reverse('api:team-list')
        data = {
            'team_name': 'New Team',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_team(self):
        url = reverse('api:team-detail', kwargs={'team_name': self.team.team_name})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_team(self):
        url = reverse('api:team-detail', kwargs={'team_name': self.team.team_name})
        data = {
            'team_name': 'Updated Team Name',
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_team(self):
        url = reverse('api:team-detail', kwargs={'team_name': self.team.team_name})
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_team_viewset_lead(self):
        url = reverse('api:team-lead', kwargs={'team_name': self.team.team_name})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, UserSerializer([self.user], many=True, context={'request': response.wsgi_request}).data)

    def test_team_viewset_subsystems(self):
        url = reverse('api:team-subsystems', kwargs={'team_name': self.team.team_name})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, SubsystemSerializer([self.subsystem], many=True, context={'request': response.wsgi_request}).data)

class SubsystemViewSetTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()

        # Assuming you have a team created for the subsystem
        self.team = Team.objects.create(
            team_name='Test Team',
        )
        self.subsystem = Subsystem.objects.create(
            subsystem_name='Test Subsystem',
            parent_team=self.team
        )

    def test_create_subsystem(self):
        url = reverse('api:subsystem-list')
        data = {
            'subsystem_name': 'New Subsystem',
            'parent_team': self.team.team_name
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_subsystem(self):
        url = reverse('api:subsystem-detail', kwargs={'subsystem_name': self.subsystem.subsystem_name})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # ... Continue with other test methods for listing, updating, deleting, etc.

    def test_subsystem_parent(self):
        url = reverse('api:subsystem-parent', kwargs={'subsystem_name': self.subsystem.subsystem_name})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_data = TeamSerializer(self.team, context={'request': response.wsgi_request}).data
        self.assertEqual(response.data, expected_data)