# backend/AI_generator/views.py

import logging
import boto3
import google.generativeai as genai
import PyPDF2
import textwrap

from io import BytesIO
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from reportlab.pdfgen import canvas

from AI_generator.models import CoverLetter
from AI_generator.serializers import (
    CoverLetterRequestSerializer,
    CoverLetterSerializer,
)

logger = logging.getLogger(__name__)


class CoverLetterPageNumberPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = "page_size"
    max_page_size = 100


@method_decorator(csrf_exempt, name="dispatch")
class GenerateCoverLetterView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def extract_text_from_pdf(self, file_obj):
        """
        Extract text from a PDF file and reset the file pointer.
        """
        try:
            reader = PyPDF2.PdfReader(file_obj)
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            file_obj.seek(0)
            return text
        except Exception as e:
            logger.error("Error extracting text from PDF: %s", e)
            raise

    def post(self, request, *args, **kwargs):
        serializer = CoverLetterRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        job_description = serializer.validated_data["job_description"]
        resume_file = serializer.validated_data["resume"]

        try:
            resume_text = self.extract_text_from_pdf(resume_file)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        prompt = (
            settings.COVER_LETTER_PROMPT
            + f"""

📌 **Applicant’s Resume**:
{resume_text}

📌 **Job Description**:
{job_description}

---
Now, generate a **highly engaging, professional, and personalized cover letter** using the format above.
**Make it feel like a real person wrote it**, avoiding stiff and robotic phrasing.
"""
        )

        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-2.0-flash-lite")
            response = model.generate_content(prompt)
            text = response.text if response else "Error generating cover letter."
            return Response({"cover_letter": text}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error("Error generating cover letter: %s", e)
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_protect, name="dispatch")
class SaveCoverLetter(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CoverLetterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        job_title = serializer.validated_data["job_title"]
        company_name = serializer.validated_data["company_name"]
        cover_letter_text = request.data.get("cover_letter")

        if not (job_title and company_name and cover_letter_text):
            return Response(
                {"error": "Job title, company name, and cover letter are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        file_name = f"cover_letters/{request.user.id}/{job_title}_{company_name}.pdf"
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer)
        pdf.setFont("Helvetica", 12)

        # Layout settings
        page_width = 780
        left_margin, right_margin = 40, 30
        usable_width = page_width - left_margin - right_margin
        x, y = left_margin, 780
        line_height = 15
        para_space = 10
        max_chars = int(usable_width / pdf.stringWidth("A", "Helvetica", 12))

        for paragraph in cover_letter_text.split("\n"):
            if not paragraph.strip():
                y -= para_space
                continue
            for line in textwrap.wrap(paragraph, width=max_chars):
                if y < 40:
                    pdf.showPage()
                    pdf.setFont("Helvetica", 12)
                    y = 780
                pdf.drawString(x, y, line)
                y -= line_height
            y -= para_space

        pdf.save()
        buffer.seek(0)

        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )
        s3.upload_fileobj(
            buffer,
            settings.AWS_STORAGE_BUCKET_NAME,
            file_name,
            ExtraArgs={"ContentType": "application/pdf"},
        )

        cover_letter = CoverLetter.objects.create(
            user=request.user,
            job_title=job_title,
            company_name=company_name,
            cover_letter_file_path=file_name,
        )
        return Response(
            {"message": "Cover letter saved", "cover_letter_id": cover_letter.id},
            status=status.HTTP_201_CREATED,
        )


class GetCoverLetterURL(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, cover_letter_id):
        try:
            cl = CoverLetter.objects.get(id=cover_letter_id, user=request.user)
        except CoverLetter.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )
        url = s3.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                "Key": cl.cover_letter_file_path,
            },
            ExpiresIn=600,
        )
        return Response({"download_url": url}, status=status.HTTP_200_OK)


class GetCoverLetters(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ordering = request.query_params.get("ordering", "-created_at")
        queryset = CoverLetter.objects.filter(user=request.user).order_by(ordering)

        paginator = CoverLetterPageNumberPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = CoverLetterSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


class DeleteCoverLetter(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, cover_letter_id):
        try:
            cl = CoverLetter.objects.get(id=cover_letter_id, user=request.user)
        except CoverLetter.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )
        s3.delete_object(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=cl.cover_letter_file_path,
        )
        cl.delete()
        return Response({"message": "Deleted"}, status=status.HTTP_200_OK)
