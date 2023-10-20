# api_test/test_validation.py

from api.models import Team, User
from api.validations import register_validation
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from django.test import TestCase

UserModel = get_user_model()


class RegisterValidationTest(TestCase):
    def setUp(self):
        self.valid_data = {
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "password123",
            "password2": "password123",
            "team": "TestTeam",
        }
        Team.objects.create(team_name="TestTeam")

    def test_valid_data(self):
        validated_data = register_validation(self.valid_data)
        self.assertIn("password", validated_data)
        self.assertNotIn("password2", validated_data)
        self.assertEqual(validated_data["team"], "TestTeam")  # Assuming the team has id 1

    def test_email_taken(self):
        taken_email = "taken@example.com"
        UserModel.objects.create(email=taken_email, password="password123")

        self.valid_data["email"] = taken_email

        with self.assertRaises(ValidationError):
            register_validation(self.valid_data)

