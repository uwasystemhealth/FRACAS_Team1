# api_test/test_validation.py

from api.models import Team, User
from api.validations import register_validation, validate_email, validate_password
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

UserModel = get_user_model()


class RegisterValidationTest(TestCase):
    def setUp(self):
        self.valid_data = {
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "password1": "password123",
            "password2": "password123",
            "team": "TestTeam",
        }
        Team.objects.create(team_name="TestTeam")

    def test_valid_data(self):
        validated_data = register_validation(self.valid_data)
        self.assertIn("password", validated_data)
        self.assertNotIn("password1", validated_data)
        self.assertNotIn("password2", validated_data)
        self.assertEqual(validated_data["team"], 1)  # Assuming the team has id 1

    def test_email_taken(self):
        taken_email = "taken@example.com"
        UserModel.objects.create(email=taken_email, password="password123")

        self.valid_data["email"] = taken_email

        with self.assertRaises(ValidationError):
            register_validation(self.valid_data)


class ValidateEmailTest(TestCase):
    def test_valid_email(self):
        valid_data = {"email": "test@example.com"}
        self.assertTrue(validate_email(valid_data))

    def test_invalid_email(self):
        invalid_data = {"email": ""}
        with self.assertRaises(ValidationError):
            validate_email(invalid_data)


class ValidatePasswordTest(TestCase):
    def test_valid_password(self):
        valid_data = {"password": "password123"}
        self.assertTrue(validate_password(valid_data))

    def test_invalid_password(self):
        invalid_data = {"password": ""}
        with self.assertRaises(ValidationError):
            validate_password(invalid_data)
