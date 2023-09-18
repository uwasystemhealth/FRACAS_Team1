from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


# user model
# ------------------------------------------------------------------------------
class User(AbstractUser):
    """
    Default custom user model for UWAM FRACAS.

    first_name, last_name, email, username, password inherited from AbstractUser

    """

    team = models.ForeignKey(
        "Team",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="teams",
    )

    # def get_absolute_url(self):
    #     return reverse("api:user-detail", kwargs={"username": self.username})

    def __str__(self):
        if self.first_name and self.last_name:
            name = self.first_name + " " + self.last_name
        else:
            name = self.username
        return str(name)


# team model
# ------------------------------------------------------------------------------
class Team(models.Model):
    """
    model for teams
    """

    team_id = models.AutoField(primary_key=True)
    team_name = models.TextField(unique=True)
    team_lead = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="team_leads",
    )

    def __str__(self):
        return str(self.team_name)


# category model
# ------------------------------------------------------------------------------
class Category(models.Model):
    """
    model for categories
    """

    category_id = models.AutoField(primary_key=True)
    category_name = models.TextField(unique=True)

    def __str__(self):
        return str(self.category_name)

    class Meta:
        verbose_name_plural = "Categories"


# subcategory model
# ------------------------------------------------------------------------------
class Subcategory(models.Model):
    """
    model for subcategories
    """

    subcategory_id = models.AutoField(primary_key=True)
    subcategory_name = models.TextField(unique=True)
    parent_category = models.ForeignKey(Category, null=False, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.subcategory_name)

    class Meta:
        verbose_name_plural = "Subcategories"


# record model
# ------------------------------------------------------------------------------
class Record(models.Model):
    """
    model for records
    """

    record_id = models.AutoField(primary_key=True)
    is_deleted = models.BooleanField(default=None, blank=True, null=True)
    status = models.TextField(blank=True, null=True)
    record_creator = models.TextField(null=True, blank=True)
    record_creation_time = models.DateTimeField(default=timezone.now)
    record_owner = models.TextField(null=True, blank=True)
    team = models.TextField(null=True, blank=True)
    team_lead = models.TextField(blank=True, null=True)
    subsystem = models.TextField(blank=True, null=True)
    car_year = models.TextField(blank=True, null=True)
    failure_time = models.DateTimeField(default=timezone.now, blank=True, null=True)
    failure_title = models.TextField(blank=True, null=True)
    failure_description = models.TextField(blank=True, null=True)
    failure_impact = models.TextField(blank=True, null=True)
    failure_cause = models.TextField(blank=True, null=True)
    failure_mechanism = models.TextField(blank=True, null=True)
    response_action_plan = models.TextField(blank=True, null=True)
    corrective_action_plan = models.TextField(blank=True, null=True)
    resolution_status = models.TextField(blank=True, null=True)
    review_date = models.DateTimeField(blank=True, null=True)
    due_date = models.DateTimeField(blank=True, null=True)
    is_resolved = models.BooleanField(blank=True, null=True, default=False)
    resolve_date = models.DateTimeField(blank=True, null=True)
    is_record_validated = models.BooleanField(blank=True, null=True, default=False)
    is_analysis_validated = models.BooleanField(blank=True, null=True, default=False)
    is_correction_validated = models.BooleanField(blank=True, null=True, default=False)
    is_reviewed = models.BooleanField(blank=True, null=True, default=False)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=None,
        related_name="record_category",
    )
    subcategory = models.ForeignKey(
        Subcategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=None,
        related_name="record_subcategory",
    )

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
    commenter = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name="commented"
    )
    creation_time = models.DateTimeField(default=timezone.now)
    comment_text = models.TextField()

    def __str__(self):
        return str(self.comment_id)
