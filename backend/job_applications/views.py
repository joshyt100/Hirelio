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
from django.core.cache import cache  # Import cache framework
from .models import JobApplication, Attachment
from .serializers import JobApplicationSerializer
from django.contrib.auth.views import method_decorator
from django.views.decorators.cache import cache_page

logger = logging.getLogger(__name__)


# Custom pagination class for 12 items per page
class JobApplicationPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 400


class JobApplicationListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def _invalidate_list_cache(self, user):
        """Invalidate list cache by incrementing a version key per user."""
        version_key = f"jobapps_list_version_{user.id}"
        if cache.get(version_key) is None:
            cache.set(version_key, 2)
        else:
            cache.incr(version_key)

    def get(self, request):
        # Get optional query parameters
        status_filter = request.query_params.get("status")
        search = request.query_params.get("search")
        page = request.query_params.get("page", "1")

        # Use a version key to support cache invalidation when data changes
        version_key = f"jobapps_list_version_{request.user.id}"
        version = cache.get(version_key) or 1

        # Build a cache key using user, version and query parameters
        cache_key = (
            f"jobapps_list_{request.user.id}_{version}_"
            f"status:{status_filter}_search:{search}_page:{page}"
        )
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

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

        paginator = JobApplicationPagination()
        result_page = paginator.paginate_queryset(job_apps, request)
        serializer = JobApplicationSerializer(result_page, many=True)
        response_data = paginator.get_paginated_response(serializer.data).data

        # Cache the paginated response (e.g., 5 minutes timeout)
        cache.set(cache_key, response_data, timeout=300)
        return Response(response_data)

    def post(self, request):
        data = request.data.copy()
        data["user"] = request.user.id
        serializer = JobApplicationSerializer(data=data)
        if serializer.is_valid():
            job_app = serializer.save()
            # Create S3 client once per request
            s3 = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME,
            )
            # Process file attachments (if any)
            attachments = request.FILES.getlist("attachments")
            for file in attachments:
                file_key = (
                    f"job_applications/{request.user.id}/{uuid.uuid4().hex}_{file.name}"
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
            # Invalidate list cache upon data change
            self._invalidate_list_cache(request.user)
            return Response(
                JobApplicationSerializer(job_app).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobApplicationDetailView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def _invalidate_list_cache(self, user):
        """Helper to invalidate list cache on update/delete."""
        version_key = f"jobapps_list_version_{user.id}"
        if cache.get(version_key) is None:
            cache.set(version_key, 2)
        else:
            cache.incr(version_key)

    def get_object(self, pk, user):
        try:
            return JobApplication.objects.prefetch_related("attachments").get(
                pk=pk, user=user
            )
        except JobApplication.DoesNotExist:
            return None

    def get(self, request, pk):
        cache_key = f"jobapp_detail_{pk}"
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        job_app = self.get_object(pk, request.user)
        if not job_app:
            return Response(
                {"error": "Job application not found"}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = JobApplicationSerializer(job_app)
        # Cache the detail response (e.g., 5 minutes timeout)
        cache.set(cache_key, serializer.data, timeout=300)
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
            s3 = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME,
            )
            attachments = request.FILES.getlist("attachments")
            for file in attachments:
                file_key = (
                    f"job_applications/{request.user.id}/{uuid.uuid4().hex}_{file.name}"
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
            # Invalidate detail view cache and list cache upon update
            cache.delete(f"jobapp_detail_{pk}")
            self._invalidate_list_cache(request.user)
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
        # Invalidate detail view cache and list cache upon deletion
        cache.delete(f"jobapp_detail_{pk}")
        self._invalidate_list_cache(request.user)
        return Response(
            {"message": "Job application deleted"}, status=status.HTTP_200_OK
        )


class DeleteAttachmentView(APIView):
    permission_classes = [IsAuthenticated]

    def _invalidate_list_cache(self, user):
        version_key = f"jobapps_list_version_{user.id}"
        if cache.get(version_key) is None:
            cache.set(version_key, 2)
        else:
            cache.incr(version_key)

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
        # Invalidate the detail cache for this job application and list cache
        cache.delete(f"jobapp_detail_{job_id}")
        self._invalidate_list_cache(request.user)
        return Response({"message": "Attachment deleted"}, status=status.HTTP_200_OK)
