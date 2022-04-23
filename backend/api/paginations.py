from rest_framework.pagination import CursorPagination
class AllblogPagination(CursorPagination):
    page_size=4
    ordering = ['blog_id']