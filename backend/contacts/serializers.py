# contacts/serializers.py

from rest_framework import serializers
from .models import Contact, Interaction


class InteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interaction
        fields = ["id", "date", "type", "notes"]


class ContactSerializer(serializers.ModelSerializer):
    # Represent the interactions as a nested serializer (read-only here)
    interactions = InteractionSerializer(many=True, read_only=True)

    class Meta:
        model = Contact
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "company",
            "position",
            "relationship",
            "notes",
            "last_contacted",
            "next_follow_up",
            "linkedin_url",
            "twitter_url",
            "is_favorite",
            "tags",
            "avatar",
            "interactions",
        ]
