from django.test import TestCase
from api.forms import UserCreationForm, UserChangeForm
from api.models import User

class UserCreationFormTest(TestCase):
    
    def test_valid_data_creates_user(self):
        form = UserCreationForm({
            'email': 'test@test.com',
            'username': 'testuser',
            'password1': 'testpassword',
            'password2': 'testpassword',
        })
        self.assertTrue(form.is_valid())
        user = form.save()
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(user.email, 'test@test.com')
        self.assertTrue(user.check_password('testpassword'))
        
    def test_passwords_must_match(self):
        form = UserCreationForm({
            'email': 'test@test.com',
            'username': 'testuser',
            'password1': 'testpassword1',
            'password2': 'testpassword2',
        })
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['password2'], ["Passwords don't match"])

class UserChangeFormTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email='user@test.com',
            password='testpassword',
            username='testuser'
        )
        
    def test_valid_data_updates_user(self):
        form = UserChangeForm({
            'email': 'newemail@test.com',
            'username': 'newusername',
            'password': self.user.password,
            'is_active': True,
            'is_admin': False,
        }, instance=self.user)
        self.assertTrue(form.is_valid())
        updated_user = form.save()
        self.assertEqual(updated_user.email, 'newemail@test.com')
        
    def test_password_remains_unchanged(self):
        original_hashed_password = self.user.password
        form = UserChangeForm({
            'email': 'newemail@test.com',
            'username': 'newusername',
            'password': original_hashed_password,
            'is_active': True,
            'is_admin': False,
        }, instance=self.user)
        updated_user = form.save()
        self.assertEqual(updated_user.password, original_hashed_password)
