from django.urls import include, path

from .views import (
    GenerateCoverLetterView,
    GetCoverLetterURL,
    SaveCoverLetter,
    GetCoverLetters,
    DeleteCoverLetter,
)

urlpatterns = [
    path("generate/", GenerateCoverLetterView.as_view(), name="generate_cover_letter"),
    path("save-cover-letter/", SaveCoverLetter.as_view(), name="save_cover_letter"),
    path(
        "get-cover-letter-url/<int:cover_letter_id>/",
        GetCoverLetterURL.as_view(),
        name="get_cover_letter_url",
    ),
    path("get-cover-letters/", GetCoverLetters.as_view(), name="get_cover_letters"),
    path(
        "delete-cover-letter/<int:cover_letter_id>/",
        DeleteCoverLetter.as_view(),
        name="delete_cover_letter",
    ),
]
