import logging
import uuid
import boto3
from django.db.models import Q  # <-- Import Q for complex queries
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.conf import settings
from .models import JobApplication, Attachment
from .serializers import JobApplicationSerializer
from django.contrib.auth.views import method_decorator
from django.views.decorators.cache import cache_page

from rest_framework.pagination import CursorPagination

logger = logging.getLogger(__name__)


# Custom pagination class for 12 items per page


class JobApplicationCursorPagination(CursorPagination):
    page_size = 12
    ordering = ["-date_applied", "-id"]


class JobApplicationListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    # @method_decorator(cache_page(60 * 3))
    def get(self, request):
        # Get optional query parameters
        status_filter = request.query_params.get("status")
        search = request.query_params.get("search")

        # Build the initial queryset filtered by user
        job_apps = JobApplication.objects.filter(user=request.user)

        # Apply status filter if provided
        if status_filter:
            job_apps = job_apps.filter(status=status_filter)

        # Apply search filter (lookup in company or position)
        if search:
            job_apps = job_apps.filter(
                Q(company__icontains=search) | Q(position__icontains=search)
            )

        # Optimize DB queries by prefetching related attachments and order results
        job_apps = job_apps.prefetch_related("attachments").order_by("-date_applied")

        paginator = JobApplicationCursorPagination()
        result_page = paginator.paginate_queryset(job_apps, request)
        serializer = JobApplicationSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        data["user"] = request.user.id
        serializer = JobApplicationSerializer(data=data)
        if serializer.is_valid():
            job_app = serializer.save()
            # Process file attachments (if any)
            attachments = request.FILES.getlist("attachments")
            for file in attachments:
                file_key = (
                    f"job_applications/{request.user.id}/{uuid.uuid4().hex}_{file.name}"
                )
                s3 = boto3.client(
                    "s3",
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                    region_name=settings.AWS_S3_REGION_NAME,
                )
                s3.upload_fileobj(
                    file,
                    settings.AWS_STORAGE_BUCKET_NAME,
                    file_key,
                    ExtraArgs={"ContentType": file.content_type},
                )
                Attachment.objects.create(
                    job_application=job_app,
                    name=file.name,
                    type="coverLetter" if "cover" in file.name.lower() else "resume",
                    file_url=file_key,
                )
            return Response(
                JobApplicationSerializer(job_app).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobApplicationDetailView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self, pk, user):
        try:
            return JobApplication.objects.prefetch_related("attachments").get(
                pk=pk, user=user
            )
        except JobApplication.DoesNotExist:
            return None

    def get(self, request, pk):
        job_app = self.get_object(pk, request.user)
        if not job_app:
            return Response(
                {"error": "Job application not found"}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = JobApplicationSerializer(job_app)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        job_app = self.get_object(pk, request.user)
        if not job_app:
            return Response(
                {"error": "Job application not found"}, status=status.HTTP_404_NOT_FOUND
            )
        data = request.data.copy()
        serializer = JobApplicationSerializer(job_app, data=data, partial=True)
        if serializer.is_valid():
            job_app = serializer.save()
            attachments = request.FILES.getlist("attachments")
            for file in attachments:
                file_key = (
                    f"job_applications/{request.user.id}/{uuid.uuid4().hex}_{file.name}"
                )
                s3 = boto3.client(
                    "s3",
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                    region_name=settings.AWS_S3_REGION_NAME,
                )
                s3.upload_fileobj(
                    file,
                    settings.AWS_STORAGE_BUCKET_NAME,
                    file_key,
                    ExtraArgs={"ContentType": file.content_type},
                )
                Attachment.objects.create(
                    job_application=job_app,
                    name=file.name,
                    type="coverLetter" if "cover" in file.name.lower() else "resume",
                    file_url=file_key,
                )
            return Response(
                JobApplicationSerializer(job_app).data, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        job_app = self.get_object(pk, request.user)
        if not job_app:
            return Response(
                {"error": "Job application not found"}, status=status.HTTP_404_NOT_FOUND
            )
        # Delete attachments from S3
        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )
        for attachment in job_app.attachments.all():
            try:
                s3.delete_object(
                    Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=attachment.file_url
                )
            except Exception as e:
                logger.error("Error deleting file from S3: %s", str(e))
        job_app.delete()
        return Response(
            {"message": "Job application deleted"}, status=status.HTTP_200_OK
        )


class DeleteAttachmentView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, job_id, attachment_id):
        try:
            job_app = JobApplication.objects.get(pk=job_id, user=request.user)
        except JobApplication.DoesNotExist:
            return Response(
                {"error": "Job application not found"}, status=status.HTTP_404_NOT_FOUND
            )
        try:
            attachment = job_app.attachments.get(pk=attachment_id)
        except Attachment.DoesNotExist:
            return Response(
                {"error": "Attachment not found"}, status=status.HTTP_404_NOT_FOUND
            )
        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )
        try:
            s3.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=attachment.file_url
            )
        except Exception as e:
            logger.error("Error deleting file from S3: %s", str(e))
        attachment.delete()
        return Response({"message": "Attachment deleted"}, status=status.HTTP_200_OK)
