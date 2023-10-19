from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend


class ApprovedUserBackend(ModelBackend):
    """
    Only approved users can login
    Users must be manually approved by an admin in the Django admin panel
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        User = get_user_model()
        try:
            user = User.objects.get(email=username)
            if user.check_password(password) and user.is_approved:
                return user
        except User.DoesNotExist:
            return None
