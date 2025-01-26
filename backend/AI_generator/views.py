from django.contrib.auth.views import method_decorator
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

# Create your views here.


# @method_decorator(csrf_exempt, name="dispatch")
# class AIGeneratorView:
#     def post(self, request):
#         resume_file = request.FILES.get("resume")
#         job_description = request.POST.get("job_description")
#
#         if resume_file and job_description:
#             print("Resume:", resume_file, "Job Description:", job_description)
