from django.db import models

# Create your models here.

from django.conf import settings
from django.db import models


class CoverLetter(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cover_letters",
        db_index=True,
    )
    job_title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    cover_letter_file_path = models.CharField(max_length=1024)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.job_title} at {self.company_name} by {self.user.email}"
