import google.generativeai as genai
import PyPDF2
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CoverLetterRequestSerializer


@method_decorator(csrf_exempt, name="dispatch")
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
                You are an expert in crafting **natural, engaging, and highly personalized cover letters**. Your goal is to create a **compelling** and **human-like** cover letter that makes the applicant stand out.
                write it in around 250 words.

                ---

                🔹 **Cover Letter Format**:
                1️⃣ **Include Applicant’s Contact Information at the Top**  
                   - Full Name  
                   - Address  
                   - City, State, Zip  
                   - Email  
                   - Phone Number  
                   - Date  

                2️⃣ **Include Company & Hiring Manager Details Below the Contact Info**  
                   - Hiring Manager's Name (if available)  
                   - Company Name  
                   - Company Address (City, State)  

                3️⃣ **Write an Engaging, Personalized Introduction**  
                   - Avoid generic openings like "I am excited to apply..."  
                   - Instead, start with a **natural, warm, and engaging** first sentence.  
                   - Mention **why the company excites the applicant** in a **real, human way**.  

                4️⃣ **Tell a Short, Compelling Career Story**  
                   - Highlight **one defining experience** that aligns with the job.  
                   - **Show**, don’t just **tell**—make it engaging, not just a list of skills.  

                5️⃣ **Demonstrate Why the Applicant is the Right Fit**  
                   - Connect **3-4 key skills** to the job description.  
                   - Explain how their experience **solves a company challenge**.  
                   - Avoid clichés like "I am a hard worker" or "I am passionate about technology."  

                6️⃣ **End with a Warm, Confident Closing Statement**  
                   - Express enthusiasm for an interview.  
                   - Avoid robotic sign-offs—use a **genuine** closing that sounds human.  

                ---

                📌 **Applicant Details**:  
                - **Name**: [Your Name]  
                - **Address**: [Your Address]  
                - **City, State, Zip**: [Your City, State, Zip]  
                - **Email**: [Your Email]  
                - **Phone**: [Your Phone Number]  
                - **Date**: [Today's Date]  

                📌 **Company Details**:  
                - **Hiring Manager**: Hiring Manager  
                - **Company Name**: LiveRamp  
                - **Company Location**: San Francisco, CA  

                📌 **Applicant’s Resume**:  
                {resume_text}

                📌 **Job Description**:  
                {job_description}

                ---

                Now, generate a **highly engaging, professional, and personalized cover letter** using the format above. **Make it feel like a real person wrote it**, avoiding stiff and robotic phrasing.
                """

                genai.configure(api_key=settings.GEMINI_API_KEY)

                model = genai.GenerativeModel("gemini-pro")

                response = model.generate_content(messages)

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
