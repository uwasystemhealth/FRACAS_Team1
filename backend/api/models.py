from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.utils import timezone


# user model manager
# https://docs.djangoproject.com/en/4.2/topics/auth/customizing/#auth-custom-user
# ------------------------------------------------------------------------------
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        """
        Creates and saves a User with the given username, email, and password.
        """
        if not email:
            raise ValueError("The Email field must be set")
        user = self.model(
            username=username, email=self.normalize_email(email), **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        """
        Creates and saves a superser with the given username, email, and password.
        """
        user = self.create_user(
            username=username, email=email, password=password, **extra_fields
        )
        user.is_admin = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


# user model
# ------------------------------------------------------------------------------
class User(AbstractBaseUser, PermissionsMixin):
    """
    Default custom user model for UWAM FRACAS.
    """

    username = models.CharField(unique=True, max_length=50)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(unique=True, max_length=50)
    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"  # satisfies built-in auth form PasswordResetForm
    REQUIRED_FIELDS = ["username"]
    team = models.ForeignKey(
        "Team",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="teams",
    )
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    # customised user manager
    objects = CustomUserManager()

    def __str__(self):
        if self.first_name and self.last_name:
            name = f"{self.first_name} {self.last_name}"
        else:
            name = self.username
        return str(name)

    @property
    def is_staff(self):
        """
        Satisifes built-in forms for user authorisation
        """
        return self.is_admin


# team model
# ------------------------------------------------------------------------------
class Team(models.Model):
    """
    model for teams
    """

    team_id = models.AutoField(primary_key=True)
    team_name = models.CharField(unique=True, max_length=100)
    team_lead = models.OneToOneField(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="team_lead"
    )

    def __str__(self):
        return str(self.team_name)


# subsystem model
# ------------------------------------------------------------------------------
class Subsystem(models.Model):
    """
    model for subsystems
    """

    subsystem_id = models.AutoField(primary_key=True)
    subsystem_name = models.CharField(unique=True, max_length=100)
    parent_team = models.ForeignKey(
        Team, null=True, blank=True, default=None, on_delete=models.CASCADE
    )

    def __str__(self):
        return str(self.subsystem_name)


# record model
# ------------------------------------------------------------------------------
class Record(models.Model):
    """
    model for records
    """

    record_id = models.AutoField(primary_key=True)
    is_deleted = models.BooleanField(default=False, blank=True, null=True)
    status = models.TextField(blank=True, null=True)
    record_creator = models.TextField(null=True, blank=True)
    record_owner = models.TextField(null=True, blank=True)
    team = models.TextField(null=True, blank=True)
    subsystem = models.ForeignKey(
        Subsystem,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=None,
        related_name="record_subsystem",
    )
    car_year = models.TextField(blank=True, null=True)
    failure_time = models.DateTimeField(default=timezone.now, blank=True, null=True)
    failure_title = models.TextField(blank=True, null=True)
    failure_description = models.TextField(blank=True, null=True)
    failure_impact = models.TextField(blank=True, null=True)
    failure_cause = models.TextField(blank=True, null=True)
    failure_mechanism = models.TextField(blank=True, null=True)
    corrective_action_plan = models.TextField(blank=True, null=True)
    team_lead = models.TextField(blank=True, null=True)
    record_creation_time = models.DateTimeField(default=timezone.now)
    due_date = models.DateTimeField(blank=True, null=True)
    resolve_date = models.DateTimeField(blank=True, null=True)
    resolution_status = models.TextField(blank=True, null=True)
    review_date = models.DateTimeField(blank=True, null=True)
    is_resolved = models.BooleanField(blank=True, null=True, default=False)
    is_record_validated = models.BooleanField(blank=True, null=True, default=False)
    is_analysis_validated = models.BooleanField(blank=True, null=True, default=False)
    is_correction_validated = models.BooleanField(blank=True, null=True, default=False)
    is_reviewed = models.BooleanField(blank=True, null=True, default=False)

    def __str__(self):
        return str(self.record_id)


# comment model
# ------------------------------------------------------------------------------
class Comment(models.Model):
    """
    model for comments
    """

    comment_id = models.AutoField(primary_key=True)
    record_id = models.ForeignKey(Record, on_delete=models.CASCADE)
    parent_comment_id = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.CASCADE
    )
    commenter = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    creation_time = models.DateTimeField(default=timezone.now)
    comment_text = models.TextField()

    def __str__(self):
        return str(self.comment_id)
