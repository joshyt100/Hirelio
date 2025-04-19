# contacts/views.py

from django.db.models import Q

import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, filters

# Change this import to match your project’s layout:
from job_applications.views import JobApplicationPageNumberPagination

from .models import Contact, Interaction
from .serializers import ContactSerializer, InteractionSerializer
from rest_framework.pagination import PageNumberPagination


class ContactPageNumberPagination(PageNumberPagination):
    page_size = 12


class ContactFilter(django_filters.FilterSet):
    # Full‑text search across name, email, company, position
    search = django_filters.CharFilter(method="filter_search")
    # Exact (case‑insensitive) match on relationship
    relationship = django_filters.CharFilter(
        field_name="relationship", lookup_expr="iexact"
    )
    # Tag lookup (adjust if your field isn’t an ArrayField/JSONField)
    tag = django_filters.CharFilter(method="filter_tag")
    # Boolean favorite filter
    is_favorite = django_filters.BooleanFilter(field_name="is_favorite")

    class Meta:
        model = Contact
        fields = ["relationship", "is_favorite"]

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value)
            | Q(email__icontains=value)
            | Q(company__icontains=value)
            | Q(position__icontains=value)
        )

    def filter_tag(self, queryset, name, value):
        return queryset.filter(tags__contains=[value])


class ContactListCreateAPIView(generics.ListCreateAPIView):
    """
    GET:  List contacts with filtering & pagination.
    POST: Create a new contact.
    """

    queryset = Contact.objects.all().order_by("-id")
    serializer_class = ContactSerializer
    pagination_class = ContactPageNumberPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ContactFilter
    ordering_fields = ["id"]


class ContactRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET:    Retrieve a single contact.
    PUT/PATCH: Update a contact.
    DELETE: Remove a contact.
    """

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer


class InteractionCreateAPIView(generics.CreateAPIView):
    """
    POST: Create a new interaction for a specific contact.
    URL must include the contact’s ID as `contact_id`.
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
