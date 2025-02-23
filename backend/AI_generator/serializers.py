from rest_framework import serializers
from django.conf import settings
import boto3

from .models import CoverLetter


class CoverLetterRequestSerializer(serializers.Serializer):
    job_description = serializers.CharField(help_text="Job Description")
    resume = serializers.FileField(help_text="Uploaded Resume")


class CoverLetterSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()  # don't save in db

    def get_download_url(self, obj):
        try:
            s3 = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME,
            )

            pre_signed_url = s3.generate_presigned_url(
                "get_object",
                Params={
                    "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                    "Key": obj.cover_letter_file.name,
                },
                ExpiresIn=600,
            )
            return pre_signed_url
        except Exception as e:
            return None

    class Meta:
        model = CoverLetter
        fields = [
            "id",
            "user",
            "job_title",
            "company_name",
            "cover_letter_file",
            "created_at",
            "download_url",
        ]
        read_only_fields = [
            "id",
            "user",
            "created_at",
        ]  # Prevents modification of these fields
