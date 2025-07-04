from django.db.models import Q, Prefetch
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
    serializer_class = ContactSerializer
    pagination_class = ContactPageNumberPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ContactFilter
    ordering_fields = ["id"]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Prefetch interactions in descending-date order
        return (
            Contact.objects.filter(user=self.request.user)
            .prefetch_related(
                Prefetch("interactions", queryset=Interaction.objects.order_by("-date"))
            )
            .order_by("-id")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        params = request.query_params
        user_id = request.user.id
        filter_key = "&".join(f"{k}={v}" for k, v in sorted(params.items()))
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
            data = self.get_serializer(page, many=True).data
            resp = self.get_paginated_response(data)
            resp.data["count"] = count
            return resp

        return Response(self.get_serializer(queryset, many=True).data)


class ContactRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user).prefetch_related(
            Prefetch("interactions", queryset=Interaction.objects.order_by("-date"))
        )


class InteractionCreateAPIView(generics.CreateAPIView):
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
    serializer_class = InteractionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Interaction.objects.select_related("contact").filter(
            contact__user=self.request.user
        )
