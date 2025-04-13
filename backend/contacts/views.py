# contacts/views.py

from rest_framework import generics
from rest_framework.pagination import CursorPagination
from .models import Contact, Interaction
from .serializers import ContactSerializer, InteractionSerializer


class ContactCursorPagination(CursorPagination):
    page_size = 10
    ordering = "-id"


class ContactListCreateAPIView(generics.ListCreateAPIView):
    """
    GET: List contacts with cursor pagination.
    POST: Create a new contact.
    """

    queryset = Contact.objects.all().order_by("-id")
    serializer_class = ContactSerializer
    pagination_class = ContactCursorPagination


class ContactRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a single contact.
    PUT/PATCH: Update a contact.
    DELETE: Remove a contact.
    """

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer


class InteractionCreateAPIView(generics.CreateAPIView):
    """
    POST: Create a new interaction for a specific contact.
    The URL should include the contact ID.
    """

    serializer_class = InteractionSerializer

    def perform_create(self, serializer):
        contact_id = self.kwargs.get("contact_id")
        try:
            contact = Contact.objects.get(pk=contact_id)
        except Contact.DoesNotExist:
            from rest_framework.exceptions import NotFound

            raise NotFound("Contact not found.")
        serializer.save(contact=contact)


class InteractionDestroyAPIView(generics.DestroyAPIView):
    """
    DELETE: Remove an interaction.
    """

    queryset = Interaction.objects.all()
    serializer_class = InteractionSerializer
