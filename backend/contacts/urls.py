# contacts/urls.py (updated)
from django.urls import path
from .views import (
    ContactListCreateAPIView,
    ContactRetrieveUpdateDestroyAPIView,
    InteractionCreateAPIView,
    InteractionDestroyAPIView,
)

urlpatterns = [
    # This route now corresponds to /api/contacts/
    path("", ContactListCreateAPIView.as_view(), name="contact-list-create"),
    # This route will be /api/contacts/<int:pk>/
    path(
        "<int:pk>/",
        ContactRetrieveUpdateDestroyAPIView.as_view(),
        name="contact-detail",
    ),
    # This route will be /api/contacts/<int:contact_id>/interactions/
    path(
        "<int:contact_id>/interactions/",
        InteractionCreateAPIView.as_view(),
        name="interaction-create",
    ),
    # This route will be /api/contacts/interactions/<int:pk>/
    path(
        "interactions/<int:pk>/",
        InteractionDestroyAPIView.as_view(),
        name="interaction-detail",
    ),
]
