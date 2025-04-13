# contacts/models.py

from django.db import models


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

    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    position = models.CharField(max_length=255, blank=True, null=True)
    relationship = models.CharField(
        max_length=50, choices=RELATIONSHIP_CHOICES, default="industry-contact"
    )
    notes = models.TextField(blank=True, null=True)
    last_contacted = models.DateField(blank=True, null=True)
    next_follow_up = models.DateField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    is_favorite = models.BooleanField(default=False)
    # Using JSONField for tags; alternatively use ArrayField (if using Postgres) or a separate Tag model.
    tags = models.JSONField(default=list, blank=True)
    avatar = models.URLField(blank=True, null=True)

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

    def __str__(self):
        return f"{self.type} on {self.date} for {self.contact.name}"
