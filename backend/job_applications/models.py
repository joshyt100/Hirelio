# Create your models here.

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class JobApplication(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="job_applications"
    )
    company = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=50)
    date_applied = models.DateField()
    notes = models.TextField(blank=True)
    salary = models.CharField(max_length=100, blank=True)
    contact_person = models.CharField(max_length=255, blank=True)
    contact_email = models.EmailField(blank=True)
    url = models.URLField(blank=True)

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
