from django.urls import path
from .views import (
    JobApplicationListCreateView,
    JobApplicationDetailView,
    DeleteAttachmentView,
)

urlpatterns = [
    # List all job applications or create a new one.
    path(
        "", JobApplicationListCreateView.as_view(), name="job_application_list_create"
    ),
    # Retrieve, update, or delete a single job application by its primary key.
    path(
        "<int:pk>/", JobApplicationDetailView.as_view(), name="job_application_detail"
    ),
    # Delete a specific attachment from a job application.
    path(
        "<int:job_id>/attachments/<int:attachment_id>/",
        DeleteAttachmentView.as_view(),
        name="delete_attachment",
    ),
]
