from django.test import TestCase
from api.forms import UserCreationForm, UserChangeForm
from api.models import User

class UserCreationFormTest(TestCase):

    def test_password_match(self):
        """Ensure the form is valid when both passwords match."""
        form = UserCreationForm({
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password1': 'test-password',
            'password2': 'test-password'
        })
        self.assertTrue(form.is_valid())

    def test_password_no_match(self):
        """Ensure form raises error when passwords don't match."""
        form = UserCreationForm({
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password1': 'test-password',
            'password2': 'wrong-password'
        })
        self.assertFalse(form.is_valid())
        self.assertIn('password2', form.errors)
        self.assertEqual(form.errors['password2'][0], "Passwords don't match")

    def test_save_user(self):
        """Ensure a user with the hashed password is saved correctly."""
        form = UserCreationForm({
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password1': 'test-password',
            'password2': 'test-password'
        })
        if form.is_valid():
            user = form.save()
            self.assertIsInstance(user, User)
            self.assertTrue(user.check_password('test-password'))

class UserChangeFormTest(TestCase):

    def setUp(self):
        """Setup a user for testing the change form."""
        self.user = User.objects.create_user(
            email='test@example.com',
            password='test-password',
            first_name='Test',
            last_name='User'
        )

    def test_change_user(self):
        """Ensure user details can be updated correctly."""
        form = UserChangeForm({
            'email': 'updated@example.com',
            'first_name': 'Updated',
            'last_name': 'User',
            'password': self.user.password,
        }, instance=self.user)
        self.assertTrue(form.is_valid())
        user = form.save()
        self.assertEqual(user.email, 'updated@example.com')
        self.assertEqual(user.first_name, 'Updated')

