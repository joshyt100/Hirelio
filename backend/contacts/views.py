# contacts/views.py

from rest_framework import generics, filters
from rest_framework.pagination import CursorPagination
from django.db.models import Q

# Import django_filters tools.
from django_filters.rest_framework import DjangoFilterBackend
import django_filters

from .models import Contact, Interaction
from .serializers import ContactSerializer, InteractionSerializer


class ContactCursorPagination(CursorPagination):
    page_size = 12
    ordering = "-id"


# contacts/views.py


class ContactFilter(django_filters.FilterSet):
    # Custom filter for full-text search across multiple fields.
    search = django_filters.CharFilter(method="filter_search")
    # Exact match for relationship (case‑insensitive).
    relationship = django_filters.CharFilter(
        field_name="relationship", lookup_expr="iexact"
    )
    # Custom filter for tag – adjust lookup if your field is implemented differently.
    tag = django_filters.CharFilter(method="filter_tag")
    # Boolean filter for favorite contacts. Use the correct field name from your model.
    is_favorite = django_filters.BooleanFilter(field_name="is_favorite")

    class Meta:
        model = Contact
        # Use the correct field name for is_favorite.
        fields = ["relationship", "is_favorite"]

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value)
            | Q(email__icontains=value)
            | Q(company__icontains=value)
            | Q(position__icontains=value)
        )

    def filter_tag(self, queryset, name, value):
        # Assuming tags is an ArrayField (PostgreSQL) or a JSONField, use contains.
        # If not, adjust this filter accordingly.
        return queryset.filter(tags__contains=[value])


class ContactListCreateAPIView(generics.ListCreateAPIView):
    """
    GET: List contacts with backend filtering and pagination.
    POST: Create a new contact.
    """

    queryset = Contact.objects.all().order_by("-id")
    serializer_class = ContactSerializer
    pagination_class = ContactCursorPagination

    # Enable filtering and ordering.
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ContactFilter
    ordering_fields = ["id"]


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
