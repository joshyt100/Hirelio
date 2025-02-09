import google.generativeai as genai
import PyPDF2
from django.conf import settings
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CoverLetterRequestSerializer


class GenerateCoverLetterView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def extract_text_from_pdf(self, file_obj):
        """Extracts text from an uploaded PDF file."""
        try:
            pdf_reader = PyPDF2.PdfReader(file_obj)
            text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")

    def post(self, request, *args, **kwargs):
        serializer = CoverLetterRequestSerializer(data=request.data)
        if serializer.is_valid():
            job_description = serializer.validated_data["job_description"]
            resume_file = serializer.validated_data["resume"]

            try:
                resume_text = self.extract_text_from_pdf(resume_file)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

            try:
                messages = f"""
                You are a professional cover letter generator.
                Using the following resume:
                {resume_text}

                And the following job description:
                {job_description}

                Generate a tailored cover letter.
                """

                # ✅ Set up the Google Gemini AI client
                genai.configure(api_key=settings.GEMINI_API_KEY)

                model = genai.GenerativeModel("gemini-pro")

                response = model.generate_content(messages)

                # ✅ Access the cover letter content
                cover_letter = (
                    response.text if response else "Error generating cover letter."
                )

                return Response(
                    {"cover_letter": cover_letter}, status=status.HTTP_200_OK
                )

            except Exception as e:
                return Response(
                    {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
