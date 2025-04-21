# Create your models here.

from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Index, F

User = get_user_model()


class JobApplication(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="job_applications",
        db_index=True,
    )
    company = models.CharField(max_length=255, db_index=True)
    position = models.CharField(max_length=255, db_index=True)
    location = models.CharField(max_length=255, blank=True, db_index=True)
    status = models.CharField(max_length=50, db_index=True)
    date_applied = models.DateField(
        db_index=True
    )  # test db in dex for date for faster queries
    notes = models.TextField(blank=True)
    salary = models.CharField(max_length=100, blank=True)
    contact_person = models.CharField(max_length=255, blank=True)
    contact_email = models.EmailField(blank=True)
    url = models.URLField(blank=True)

    class Meta:
        indexes = [
            Index(
                fields=["user", "-date_applied", "-id"]
            ),  # match your pagination ordering
            Index(fields=["user", "status", "-date_applied", "-id"]),
            Index(fields=["user", "status", "position", "-date_applied", "-id"]),
            Index(fields=["user", "status", "company", "-date_applied", "-id"]),
            Index(fields=["user", "company", "-date_applied", "-id"]),
            # Index(fields=["user", "status", "location", "-date_applied", "-id"]),
        ]

    def __str__(self):
        return f"{self.position} at {self.company}"


class Attachment(models.Model):
    job_application = models.ForeignKey(
        JobApplication, on_delete=models.CASCADE, related_name="attachments"
    )
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50)
    file_url = models.CharField(max_length=500)  # This stores the S3 file key/path
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
