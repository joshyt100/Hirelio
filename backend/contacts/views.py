from django.db.models import Q
import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from django.core.cache import cache
import hashlib

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
    GET: List contacts with filtering, ordering, pagination, and interaction prefetching.
    POST: Create a new contact tied to the authenticated user.
    """

    serializer_class = ContactSerializer
    pagination_class = ContactPageNumberPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ContactFilter
    ordering_fields = ["id"]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Contact.objects.filter(user=self.request.user)
            .prefetch_related("interactions")
            .order_by("-id")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        query_params = request.query_params
        user_id = request.user.id
        filter_key = "&".join(f"{k}={v}" for k, v in sorted(query_params.items()))
        raw_key = f"contacts_count:{user_id}:{filter_key}"
        key_hash = hashlib.md5(raw_key.encode()).hexdigest()
        cache_key = f"contacts_count:{key_hash}"

        queryset = self.filter_queryset(self.get_queryset())
        count = cache.get(cache_key)
        if count is None:
            count = queryset.count()
            cache.set(cache_key, count, timeout=60 * 15)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            response.data["count"] = count  # Ensure accurate total
            return response

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ContactRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET:    Retrieve a single contact and its interactions.
    PUT:    Update a contact.
    DELETE: Delete a contact.
    """

    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user).prefetch_related(
            "interactions"
        )


class InteractionCreateAPIView(generics.CreateAPIView):
    """
    POST: Create a new interaction for a given contact ID.
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
    DELETE: Delete an interaction (ownership is validated via contact.user).
    """

    serializer_class = InteractionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Interaction.objects.select_related("contact").filter(
            contact__user=self.request.user
        )
