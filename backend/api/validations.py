from django.contrib.auth import get_user_model
from rest_framework import serializers

UserModel = get_user_model()


def register_validation(data):
    """Validates the data for user registration.

    Args:
        data (dict): A dictionary containing the user data.

    Returns:
        dict: The validated data with the password and team fields set.

    Raises:
        ValidationError: If the email is already taken, the password is too short, or the passwords do not match.
    """
    # strip all whitespace from the data, capitalize first and last name
    data["email"] = data["email"].strip()
    data["first_name"] = (
        data["first_name"].strip()[0].upper() + data["first_name"].strip()[1:]
    )
    data["last_name"] = (
        data["last_name"].strip()[0].upper() + data["last_name"].strip()[1:]
    )
    data["password"] = data["password"].strip()
    data["password2"] = data["password2"].strip()

    if not data["email"] or UserModel.objects.filter(email=data["email"]).exists():
        raise serializers.ValidationError("Email taken: choose another email.")
    if not data["password"] or len(data["password"]) < 8:
        raise serializers.ValidationError("Choose another password, min 8 characters.")
    if not data["first_name"]:
        raise serializers.ValidationError("First name is required.")
    if not data["last_name"]:
        raise serializers.ValidationError("Last name is required.")
    if not data["password2"] or data["password"] != data["password2"]:
        raise serializers.ValidationError("Passwords must match.")
    else:
        data.pop("password2")
        # new registered user is not staff or admin
        data["is_staff"] = False
        data["is_admin"] = False
    return data
