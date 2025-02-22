from rest_framework import serializers

from .models import CoverLetter


class CoverLetterRequestSerializer(serializers.Serializer):
    job_description = serializers.CharField(help_text="Job Description")
    resume = serializers.FileField(help_text="Uploaded Resume")


class CoverLetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoverLetter
        fields = [
            "id",
            "user",
            "job_title",
            "company_name",
            "cover_letter_file",
            "created_at",
            # "dowload_url",
        ]
        read_only_fields = [
            "id",
            "user",
            "created_at",
        ]  # Prevents modification of these fields
