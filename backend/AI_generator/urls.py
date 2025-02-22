from django.urls import include, path

from .views import GenerateCoverLetterView, GetCoverLetterURL, SaveCoverLetter

urlpatterns = [
    path("generate/", GenerateCoverLetterView.as_view(), name="generate_cover_letter"),
    path("save-cover-letter/", SaveCoverLetter.as_view(), name="save_cover_letter"),
    path(
        "get-cover-letter-url/<int:cover_letter_id>/",
        GetCoverLetterURL.as_view(),
        name="get_cover_letter_url",
    ),
]
