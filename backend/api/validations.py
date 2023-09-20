from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

from .models import Team

UserModel = get_user_model()


def register_validation(data):
    email = data["email"].strip()
    username = data["username"].strip()
    password1 = data["password1"].strip()
    password2 = data["password2"].strip()
    team = data["team"].strip()
    ##
    if not email or UserModel.objects.filter(email=email).exists():
        raise ValidationError("choose another email")
    ##
    if not password1 or len(password1) < 8:
        raise ValidationError("choose another password, min 8 characters")

    if not password2 or password1 != password2:
        raise ValidationError("passwords don't match")
    else:
        data["password"] = password1
        data.pop("password1")
        data.pop("password2")
    if not username or UserModel.objects.filter(username=username).exists():
        raise ValidationError("choose another username")
    if not team or not Team.objects.filter(team_name__iexact=team).exists():
        # team not found or not provided
        # can change this later
        data["team"] = None
    else:
        data["team"] = Team.objects.get(team_name__iexact=team).pk
    return data


def validate_email(data):
    email = data["email"].strip()
    if not email:
        raise ValidationError("an email is needed")
    return True


def validate_username(data):
    username = data["username"].strip()
    if not username:
        raise ValidationError("choose another username")
    return True


def validate_password(data):
    password = data["password"].strip()
    if not password:
        raise ValidationError("a password is needed")
    return True
