# AI_generator/pagination.py


from rest_framework.pagination import CursorPagination


class CoverLetterCursorPagination(CursorPagination):
    page_size = 20
    ordering = "-created_at"
    cursor_query_param = "cursor"
