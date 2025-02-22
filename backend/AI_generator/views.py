import logging

import boto3
import google.generativeai as genai
import PyPDF2
from AI_generator.models import CoverLetter
from AI_generator.serializers import CoverLetterRequestSerializer, CoverLetterSerializer
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

logger = logging.getLogger(__name__)


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
            model = genai.GenerativeModel("gemini-pro")
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

        if not job_title or not company_name:
            return Response(
                {"error": "Job title and company name are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            cover_letter = serializer.save(user=request.user)
        except Exception as e:
            logger.error("Error saving cover letter model instance: %s", str(e))
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Ensure the file pointer is reset before uploading to S3
        if cover_letter.cover_letter_file:
            file_name = cover_letter.cover_letter_file.name
            cover_letter.cover_letter_file.seek(0)  # Reset the file pointer
            try:
                # Upload the file to S3
                s3 = boto3.client(
                    "s3",
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                    region_name=settings.AWS_S3_REGION_NAME,
                )
                s3.upload_fileobj(
                    cover_letter.cover_letter_file,
                    settings.AWS_STORAGE_BUCKET_NAME,
                    file_name,
                )
                logger.info("File saved successfully to S3: %s", file_name)
            except Exception as e:
                logger.error("Error saving file to S3: %s", str(e))
                return Response(
                    {"error": "Failed to save file to S3: " + str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        return Response(
            {"message": "Cover letter saved successfully"},
            status=status.HTTP_201_CREATED,
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
                    "Key": cover_letter.cover_letter_file.name,
                },
                ExpiresIn=600,  # URL expires in 10 minutes.
            )
            return Response({"url": pre_signed_url}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error("Error generating pre-signed URL: %s", str(e))
            return Response(
                {"error": "Failed to generate URL: " + str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
