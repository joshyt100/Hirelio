# AI_generator/pagination.py

from rest_framework.pagination import PageNumberPagination


class CoverLetterPagination(PageNumberPagination):
    page_size = 12  # default letters per page
    page_size_query_param = "page_size"
    max_page_size = 100
