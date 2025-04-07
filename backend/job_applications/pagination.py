from rest_framework.pagination import CursorPagination


class JobApplicationCursorPagination(CursorPagination):
    page_size = 12
    ordering = ["-date_applied", "-id"]
