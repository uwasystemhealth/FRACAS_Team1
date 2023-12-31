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
    def create_user(self, first_name, last_name, email, password=None, **extra_fields):
        """Creates and saves a User with the given first_name, last_name, email, and password."""
        if not email:
            raise ValueError("The Email field must be set")
        user = self.model(
            first_name=first_name,
            last_name=last_name,
            email=self.normalize_email(email),
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self, first_name, last_name, email, password=None, **extra_fields
    ):
        """Creates and saves a superser with the given first_name, last_name, email, and password."""
        user = self.create_user(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
            **extra_fields,
        )
        user.is_active = True
        user.is_admin = True
        user.is_superuser = True
        user.is_staff = True
        user.is_approved = True
        user.save(using=self._db)
        return user


# user model
# ------------------------------------------------------------------------------
class User(AbstractBaseUser, PermissionsMixin):
    """Default custom user model for UWAM FRACAS."""

    user_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(unique=True, max_length=50)
    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"  # satisfies built-in auth form PasswordResetForm
    REQUIRED_FIELDS = ["first_name", "last_name"]
    team = models.ForeignKey(
        "Team",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="teams",
    )
    is_active = models.BooleanField(default=True, verbose_name="Email Verified")
    is_admin = models.BooleanField(default=False, verbose_name="Admin")
    is_staff = models.BooleanField(default=False, verbose_name="Team Lead")
    is_superuser = models.BooleanField(default=False, verbose_name="Superuser")
    is_approved = models.BooleanField(default=False, verbose_name="Approved")

    # customised user manager
    objects = CustomUserManager()

    def __str__(self):
        if self.first_name and self.last_name:
            name = f"{self.first_name} {self.last_name}"
        else:
            name = self.user_id
        return str(name)

    def save(self, *args, **kwargs):
        """
        Ensure that is_superuser is always the same as is_admin.
        Ensure that all admins are also staff.
        """
        self.is_superuser = self.is_admin
        if self.is_admin:
            self.is_staff = True
        super().save(*args, **kwargs)


# team model
# ------------------------------------------------------------------------------
class Team(models.Model):
    """Model for teams"""

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
    """Model for subsystems"""

    subsystem_id = models.AutoField(primary_key=True)
    subsystem_name = models.CharField(unique=True, max_length=100)
    parent_team = models.ForeignKey(
        Team, null=True, blank=True, on_delete=models.CASCADE
    )

    def __str__(self):
        return str(self.subsystem_name)


# car model
# ------------------------------------------------------------------------------
class Car(models.Model):
    """Model for cars"""

    car_id = models.AutoField(primary_key=True)
    car_year = models.IntegerField(unique=True)
    car_nickname = models.CharField(blank=True, null=True, max_length=100)

    def __str__(self):
        if self.car_year and self.car_nickname:
            name = f"{self.car_year} '{self.car_nickname}'"
        else:
            name = self.car_year
        return str(name)


# record model
# ------------------------------------------------------------------------------
class Record(models.Model):
    """Model for records"""

    record_id = models.AutoField(primary_key=True)
    is_deleted = models.BooleanField(default=False, blank=True, null=True)
    status = models.TextField(blank=True, null=True)
    record_creator = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created",
    )
    record_creator_unlinked = models.TextField(null=True, blank=True)
    record_owner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="owns",
    )
    record_owner_unlinked = models.TextField(null=True, blank=True)
    record_editors = models.ManyToManyField(User, blank=True)
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True)
    team_unlinked = models.TextField(blank=True, null=True)
    subsystem = models.ForeignKey(
        Subsystem,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    subsystem_unlinked = models.TextField(blank=True, null=True)
    car_year = models.ForeignKey(Car, on_delete=models.SET_NULL, null=True, blank=True)
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
    record_creator_email = models.TextField(blank=True, null=True)
    record_owner_email = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        """
        when creating a new record save the unlinked fields as strings of their foreign table counterparts
        """
        creating = self._state.adding
        if creating:
            if self.record_creator:
                self.record_creator_unlinked = str(self.record_creator)
                self.record_creator_email = self.record_creator.email
            if self.record_owner:
                self.record_owner_unlinked = str(self.record_owner)
                self.record_owner_email = self.record_owner.email
            if self.team:
                self.team_unlinked = str(self.team)
            if self.subsystem:
                self.subsystem_unlinked = str(self.subsystem)
            # also fill in team lead based on selected team
            if self.team:
                self.team_lead = str(self.team.team_lead)

        super(Record, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.record_id)


# comment model
# ------------------------------------------------------------------------------
class Comment(models.Model):
    """Model for comments"""

    comment_id = models.AutoField(primary_key=True)
    record_id = models.ForeignKey(Record, on_delete=models.CASCADE)
    parent_comment_id = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.CASCADE
    )
    commenter = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL
    )
    creation_time = models.DateTimeField(default=timezone.now)
    comment_text = models.TextField()

    def __str__(self):
        return str(self.comment_id)
