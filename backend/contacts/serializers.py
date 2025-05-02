from rest_framework import serializers
from .models import Contact, Interaction


class InteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interaction
        fields = ["id", "date", "type", "notes"]


class ContactSerializer(serializers.ModelSerializer):
    # Expose interactions in descending-date order
    interactions = serializers.SerializerMethodField()

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

    def get_interactions(self, obj):
        # Because of Interaction.Meta.ordering, .all() is already newest first
        qs = obj.interactions.all()
        return InteractionSerializer(qs, many=True).data
