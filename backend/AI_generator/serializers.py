from rest_framework import serializers


class CoverLetterRequestSerializer(serializers.Serializer):
    job_description = serializers.CharField(help_text="Job Description")
    resume = serializers.FileField(help_text="Uploaded Resume")
