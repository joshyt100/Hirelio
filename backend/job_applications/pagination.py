from rest_framework.pagination import CursorPagination


class JobApplicationCursorPagination(CursorPagination):
    page_size = 24  # changed pagination from 12 to 24
    ordering = ["-date_applied", "-id"]
