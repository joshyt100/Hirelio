import logging

import boto3
import google.generativeai as genai
import PyPDF2
from io import BytesIO
from AI_generator.models import CoverLetter
from AI_generator.serializers import CoverLetterRequestSerializer, CoverLetterSerializer
from AI_generator.pagination import CoverLetterCursorPagination
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from reportlab.pdfgen import canvas
import textwrap
from django.views.decorators.cache import cache_page
from rest_framework.pagination import PageNumberPagination


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
            pdf_reader = PyPDF2.PdfReader(file_obj)
            text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            # Reset the file pointer so the file remains available.
            file_obj.seek(0)
            return text
        except Exception as e:
            logger.error("Error extracting text from PDF: %s", str(e))
            raise Exception("Error extracting text from PDF: " + str(e))

    def post(self, request, *args, **kwargs):
        serializer = CoverLetterRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        job_description = serializer.validated_data.get("job_description")
        resume_file = serializer.validated_data.get("resume")

        try:
            resume_text = self.extract_text_from_pdf(resume_file)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Build the prompt using the configured cover letter prompt.
            prompt = settings.COVER_LETTER_PROMPT
            prompt += f"""
📌 **Applicant’s Resume**:
{resume_text}

📌 **Job Description**:
{job_description}

---
Now, generate a **highly engaging, professional, and personalized cover letter** using the format above.
**Make it feel like a real person wrote it**, avoiding stiff and robotic phrasing.
"""
            # Configure and call the generative AI model.
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-2.0-flash-lite")
            response = model.generate_content(prompt)
            generated_cover_letter = (
                response.text if response else "Error generating cover letter."
            )

            return Response(
                {"cover_letter": generated_cover_letter}, status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error("Error generating cover letter: %s", str(e))
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
        job_title = serializer.validated_data.get("job_title")
        company_name = serializer.validated_data.get("company_name")
        cover_letter_text = request.data.get("cover_letter")

        if not job_title or not company_name or not cover_letter_text:
            return Response(
                {"error": "Job title and company name and cover letter are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            file_name = (
                f"cover_letters/{request.user.id}/{job_title}_{company_name}.pdf"
            )
            buffer = BytesIO()
            pdf = canvas.Canvas(buffer)
            pdf.setFont("Helvetica", 12)

            page_width = 780  # A4 width in points
            left_margin = 40
            right_margin = 30
            usable_width = page_width - left_margin - right_margin

            # Starting text position
            x_position = left_margin
            y_position = 780  # Start from the top of the page

            # Wrap text properly while preserving paragraph breaks
            line_height = 15  # Space between lines
            paragraph_spacing = 10  # Extra space between paragraphs
            max_chars_per_line = int(
                usable_width / pdf.stringWidth("A", "Helvetica", 12)
            )

            for paragraph in cover_letter_text.split("\n"):
                if (
                    not paragraph.strip()
                ):  # If it's an empty line, add a paragraph space
                    y_position -= paragraph_spacing
                    continue

                wrapped_lines = textwrap.wrap(paragraph, width=max_chars_per_line)

                for line in wrapped_lines:
                    if y_position < 40:  # Move to a new page if reaching bottom margin
                        pdf.showPage()
                        pdf.setFont("Helvetica", 12)
                        y_position = 780  # Reset y-position for new page

                    pdf.drawString(x_position, y_position, line)
                    y_position -= line_height  # Move down for the next line

                y_position -= paragraph_spacing  # Extra space between paragraphs

            pdf.save()
            buffer.seek(0)  # Reset pointer for buffer (for upload)

            # generate PDF from text
            s3 = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME,  # Ensure the correct region is set.
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
                cover_letter_file_path=file_name,  # Store only the structured path
            )

            return Response(
                {
                    "message": "Cover letter saved successfully",
                    "cover_letter_id": cover_letter.id,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetCoverLetterURL(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, cover_letter_id):
        try:
            cover_letter = CoverLetter.objects.get(
                id=cover_letter_id, user=request.user
            )

        except CoverLetter.DoesNotExist:
            return Response(
                {"error": "Cover letter not found"}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            s3 = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME,  # Ensure the correct region is set.
            )

            pre_signed_url = s3.generate_presigned_url(
                "get_object",
                Params={
                    "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                    "Key": cover_letter.cover_letter_file_path,  # use stored path for s3 url
                },
                ExpiresIn=600,  # URL expires in 10 minutes.
            )
            return Response({"download_url": pre_signed_url}, status=status.HTTP_200_OK)

            # exception handling
        except Exception as e:
            logger.error("Error generating pre-signed URL: %s", str(e))
            return Response(
                {"error": "Failed to generate URL: " + str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# @method_decorator(cache_page(60), name="dispatch")
class GetCoverLetters(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 1. Query only this user’s cover letters, newest first
        cover_letters = CoverLetter.objects.filter(user=request.user).order_by(
            "-created_at"
        )

        # 2. Use page‑number pagination (18 items per page)
        paginator = CoverLetterPageNumberPagination()
        page = paginator.paginate_queryset(cover_letters, request)

        # 3. Serialize that single page
        serializer = CoverLetterSerializer(page, many=True)

        # 4. Return the paginated response
        return paginator.get_paginated_response(serializer.data)


class DeleteCoverLetter(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, cover_letter_id):
        try:
            cover_letter = CoverLetter.objects.get(
                id=cover_letter_id, user=request.user
            )
            s3 = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME,  # Ensure the correct region is set.
            )
            s3.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=cover_letter.cover_letter_file_path,
            )
            cover_letter.delete()
            return Response(
                {"message": "Cover letter deleted successfully"},
                status=status.HTTP_200_OK,
            )

        except CoverLetter.DoesNotExist:
            return Response(
                {"error": "Cover letter not found"}, status=status.HTTP_404_NOT_FOUND
            )
