# contacts/models.py


from django.db import models
from django.db.models import indexes
from django.contrib.postgres.indexes import GinIndex
from django.contrib.auth import get_user_model

User = get_user_model()


class Contact(models.Model):
    RELATIONSHIP_CHOICES = [
        ("former-colleague", "Former Colleague"),
        ("current-colleague", "Current Colleague"),
        ("classmate", "Classmate"),
        ("friend", "Friend"),
        ("mentor", "Mentor"),
        ("recruiter", "Recruiter"),
        ("manager", "Manager"),
        ("industry-contact", "Industry Contact"),
        ("other", "Other"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="contacts",
        db_index=True,
    )
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    position = models.CharField(max_length=255, blank=True, null=True)
    relationship = models.CharField(
        max_length=50,
        choices=RELATIONSHIP_CHOICES,
        default="industry-contact",
        db_index=True,
    )
    notes = models.TextField(blank=True, null=True)
    last_contacted = models.DateField(blank=True, null=True)
    next_follow_up = models.DateField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    is_favorite = models.BooleanField(default=False, db_index=True)
    tags = models.JSONField(default=list, blank=True, db_index=True)
    avatar = models.URLField(blank=True, null=True)

    class Meta:
        indexes = [
            indexes.Index(fields=["user", "-id"]),
            indexes.Index(fields=["user", "relationship", "-id"]),
            models.Index(fields=["user", "is_favorite"]),
            GinIndex(fields=["tags"]),
        ]

    def __str__(self):
        return self.name


class Interaction(models.Model):
    INTERACTION_TYPES = [
        ("email", "Email"),
        ("call", "Call"),
        ("meeting", "Meeting"),
        ("message", "Message"),
        ("other", "Other"),
    ]

    contact = models.ForeignKey(
        Contact, on_delete=models.CASCADE, related_name="interactions"
    )
    date = models.DateField()
    type = models.CharField(max_length=20, choices=INTERACTION_TYPES, default="email")
    notes = models.TextField(blank=True, null=True)

    class Meta:
        # Always order interactions newest first
        ordering = ["-date"]
        indexes = [
            models.Index(fields=["contact", "-date"]),
        ]

    def __str__(self):
        return f"{self.type} on {self.date} for {self.contact.name}"
