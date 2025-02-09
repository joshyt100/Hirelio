from django.urls import include, path

from .views import GenerateCoverLetterView

urlpatterns = [
    path("generate/", GenerateCoverLetterView.as_view(), name="generate_cover_letter"),
]
