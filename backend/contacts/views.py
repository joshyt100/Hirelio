# contacts/views.py

from django.db.models import Q
import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import NotFound

from .models import Contact, Interaction
from .serializers import ContactSerializer, InteractionSerializer


class ContactPageNumberPagination(PageNumberPagination):
    page_size = 12


class ContactFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method="filter_search")
    relationship = django_filters.CharFilter(
        field_name="relationship", lookup_expr="iexact"
    )
    tag = django_filters.CharFilter(method="filter_tag")
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

    serializer_class = ContactSerializer
    pagination_class = ContactPageNumberPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ContactFilter
    ordering_fields = ["id"]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user).order_by("-id")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ContactRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET:    Retrieve a single contact.
    PUT/PATCH: Update a contact.
    DELETE: Remove a contact.
    """

    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user)


class InteractionCreateAPIView(generics.CreateAPIView):
    """
    POST: Create a new interaction for a specific contact.
    URL must include the contact’s ID as `contact_id`.
    """

    serializer_class = InteractionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        contact_id = self.kwargs.get("contact_id")
        try:
            contact = Contact.objects.get(pk=contact_id, user=self.request.user)
        except Contact.DoesNotExist:
            raise NotFound("Contact not found.")
        serializer.save(contact=contact)


class InteractionDestroyAPIView(generics.DestroyAPIView):
    """
    DELETE: Remove an interaction.
    """

    serializer_class = InteractionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Interaction.objects.filter(contact__user=self.request.user)
