import logging
import uuid
import boto3
import time
import hashlib
from functools import wraps

from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from .models import JobApplication, Attachment
from .serializers import JobApplicationSerializer
from django.core.cache import cache
from rest_framework.pagination import CursorPagination
from job_applications.pagination import JobApplicationCursorPagination

logger = logging.getLogger(__name__)

LIST_CACHE_TIMEOUT = 60 * 15  # 15 minutes
DETAIL_CACHE_TIMEOUT = 60 * 30  # 30 minutes
CACHE_VERSION = 1  # Bump this to invalidate old caches when models change


def generate_cache_key(user_id, query_params=None, detail_id=None):
    """
    Generate a unique cache key based on user ID, query parameters,
    and optionally a detail ID. Now includes sortOrder.
    """
    if detail_id:
        return f"jad:{user_id}:{detail_id}:v{CACHE_VERSION}"

    base_key = f"jal:{user_id}:v{CACHE_VERSION}"
    if query_params:
        # Include sortOrder among the allowed keys.
        filtered = {
            k: v
            for k, v in query_params.items()
            if k in ("status", "search", "sortOrder", "cursor") and v
        }
        if filtered:
            param_str = "&".join(f"{k}={v}" for k, v in sorted(filtered.items()))
            param_hash = hashlib.md5(param_str.encode()).hexdigest()[:10]
            return f"{base_key}:{param_hash}"
    return base_key


def invalidate_user_caches(user_id):
    """
    Invalidate all cache entries for the given user.
    """
    try:
        cache.delete_pattern(f"jal:{user_id}:*")
        cache.delete_pattern(f"jad:{user_id}:*")
    except AttributeError:
        # Fallback if delete_pattern is unavailable
        keys = [f"jal:{user_id}:v{CACHE_VERSION}", f"jad:{user_id}:*:v{CACHE_VERSION}"]
        for key in keys:
            cache.delete(key)


def cached_response(timeout):
    """
    Decorator for caching GET responses.
    """

    def decorator(view_func):
        @wraps(view_func)
        def wrapper(self, request, *args, **kwargs):
            if request.method != "GET":
                return view_func(self, request, *args, **kwargs)
            if "pk" in kwargs:
                # Detail view caching
                cache_key = generate_cache_key(request.user.id, detail_id=kwargs["pk"])
                current_timeout = DETAIL_CACHE_TIMEOUT
            else:
                # Include sortOrder in caching
                params = {
                    "status": request.query_params.get("status", ""),
                    "search": request.query_params.get("search", ""),
                    "cursor": request.query_params.get("cursor", ""),
                    "sortOrder": request.query_params.get("sortOrder", ""),
                }
                cache_key = generate_cache_key(request.user.id, params)
                current_timeout = timeout
            cached_data = cache.get(cache_key)
            if cached_data:
                logger.info(f"Cache hit for key: {cache_key}")
                return Response(cached_data)
            response = view_func(self, request, *args, **kwargs)
            if response.status_code in (200, 201):
                cache.set(cache_key, response.data, current_timeout)
            return response

        return wrapper

    return decorator


def get_s3_client():
    """
    Helper to instantiate and return an S3 client.
    """
    return boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
    )


class JobApplicationListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @cached_response(LIST_CACHE_TIMEOUT)
    def get(self, request):
        total_start = time.time()

        # Get query parameters
        status_filter = request.query_params.get("status")
        search = request.query_params.get("search")
        sort_order = request.query_params.get(
            "sortOrder", "desc"
        )  # default to descending
        t1 = time.time()
        job_apps = JobApplication.objects.filter(user=request.user)
        if status_filter:
            job_apps = job_apps.filter(status=status_filter)
        if search:
            search_terms = search.strip().split()
            query = Q()
            for term in search_terms:
                query |= Q(company__icontains=term) | Q(position__icontains=term)
            job_apps = job_apps.filter(query)
        t2 = time.time()

        # Determine ordering based on sortOrder parameter.
        if sort_order == "asc":
            order_by_fields = ("date_applied", "id")
        else:
            order_by_fields = ("-date_applied", "-id")

        # Apply ordering and prefetch/join optimizations.
        job_apps = (
            job_apps.select_related("user")
            .prefetch_related("attachments")
            .order_by(*order_by_fields)
        )
        t3 = time.time()

        # Pagination using cursor pagination.
        paginator = JobApplicationCursorPagination()
        page = paginator.paginate_queryset(job_apps, request)
        t4 = time.time()
        serializer = JobApplicationSerializer(page, many=True)
        t5 = time.time()
        response = paginator.get_paginated_response(serializer.data)
        total_end = time.time()

        # Log performance metrics.
        logger.debug(f"[Timer] Filtering: {(t2 - t1):.3f}s")
        logger.debug(f"[Timer] Prefetch/order: {(t3 - t2):.3f}s")
        logger.debug(f"[Timer] Pagination: {(t4 - t3):.3f}s")
        logger.debug(f"[Timer] Serialization: {(t5 - t4):.3f}s")
        logger.debug(f"[Timer] Total view time: {(total_end - total_start):.3f}s")
        return response

    def post(self, request):
        start_time = time.time()
        data = request.data.copy()
        data["user"] = request.user.id

        serializer = JobApplicationSerializer(data=data)
        if serializer.is_valid():
            job_app = serializer.save()
            attachments = request.FILES.getlist("attachments")
            if attachments:
                s3 = get_s3_client()
                attachment_objects = []
                for file in attachments:
                    file_key = f"job_applications/{request.user.id}/{uuid.uuid4().hex}_{file.name}"
                    s3.upload_fileobj(
                        file,
                        settings.AWS_STORAGE_BUCKET_NAME,
                        file_key,
                        ExtraArgs={"ContentType": file.content_type},
                    )
                    attachment_type = (
                        "coverLetter" if "cover" in file.name.lower() else "resume"
                    )
                    attachment_objects.append(
                        Attachment(
                            job_application=job_app,
                            name=file.name,
                            type=attachment_type,
                            file_url=file_key,
                        )
                    )
                if attachment_objects:
                    Attachment.objects.bulk_create(attachment_objects)
            invalidate_user_caches(request.user.id)
            end_time = time.time()
            logger.debug(
                f"[Timer] Create job application: {(end_time - start_time):.3f}s"
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

    @cached_response(DETAIL_CACHE_TIMEOUT)
    def get(self, request, pk):
        job_app = self.get_object(pk, request.user)
        if not job_app:
            return Response(
                {"error": "Job application not found"}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = JobApplicationSerializer(job_app)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        start_time = time.time()
        job_app = self.get_object(pk, request.user)
        if not job_app:
            return Response(
                {"error": "Job application not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = JobApplicationSerializer(
            job_app, data=request.data.copy(), partial=True
        )
        if serializer.is_valid():
            job_app = serializer.save()
            attachments = request.FILES.getlist("attachments")
            if attachments:
                s3 = get_s3_client()
                attachment_objects = []
                for file in attachments:
                    file_key = f"job_applications/{request.user.id}/{uuid.uuid4().hex}_{file.name}"
                    s3.upload_fileobj(
                        file,
                        settings.AWS_STORAGE_BUCKET_NAME,
                        file_key,
                        ExtraArgs={"ContentType": file.content_type},
                    )
                    attachment_type = (
                        "coverLetter" if "cover" in file.name.lower() else "resume"
                    )
                    attachment_objects.append(
                        Attachment(
                            job_application=job_app,
                            name=file.name,
                            type=attachment_type,
                            file_url=file_key,
                        )
                    )
                if attachment_objects:
                    Attachment.objects.bulk_create(attachment_objects)
            cache.delete(generate_cache_key(request.user.id, detail_id=pk))
            invalidate_user_caches(request.user.id)
            end_time = time.time()
            logger.debug(
                f"[Timer] Update job application: {(end_time - start_time):.3f}s"
            )
            return Response(
                JobApplicationSerializer(job_app).data, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        start_time = time.time()
        job_app = self.get_object(pk, request.user)
        if not job_app:
            return Response(
                {"error": "Job application not found"}, status=status.HTTP_404_NOT_FOUND
            )
        attachments = list(job_app.attachments.all())
        if attachments:
            s3 = get_s3_client()
            s3_objects = [{"Key": att.file_url} for att in attachments]
            try:
                if s3_objects:
                    s3.delete_objects(
                        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                        Delete={"Objects": s3_objects},
                    )
            except Exception as e:
                logger.error("Error batch deleting from S3: %s", str(e))
                for att in attachments:
                    try:
                        s3.delete_object(
                            Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=att.file_url
                        )
                    except Exception as ex:
                        logger.error("Error deleting file from S3: %s", str(ex))
        job_app.delete()
        cache.delete(generate_cache_key(request.user.id, detail_id=pk))
        invalidate_user_caches(request.user.id)
        end_time = time.time()
        logger.debug(f"[Timer] Delete job application: {(end_time - start_time):.3f}s")
        return Response(
            {"message": "Job application deleted"}, status=status.HTTP_200_OK
        )


class DeleteAttachmentView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, job_id, attachment_id):
        start_time = time.time()
        try:
            job_app = JobApplication.objects.select_related().get(
                pk=job_id, user=request.user
            )
        except JobApplication.DoesNotExist:
            return Response(
                {"error": "Job application not found"}, status=status.HTTP_404_NOT_FOUND
            )
        try:
            attachment = Attachment.objects.get(
                pk=attachment_id, job_application=job_app
            )
        except Attachment.DoesNotExist:
            return Response(
                {"error": "Attachment not found"}, status=status.HTTP_404_NOT_FOUND
            )
        s3 = get_s3_client()
        try:
            s3.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=attachment.file_url
            )
        except Exception as e:
            logger.error("Error deleting file from S3: %s", str(e))
        attachment.delete()
        cache.delete(generate_cache_key(request.user.id, detail_id=job_id))
        end_time = time.time()
        logger.debug(f"[Timer] Delete attachment: {(end_time - start_time):.3f}s")
        return Response({"message": "Attachment deleted"}, status=status.HTTP_200_OK)
