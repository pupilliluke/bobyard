from rest_framework import viewsets, status
from rest_framework.response import Response
from django.utils import timezone
from .models import Comment
from .serializers import CommentSerializer


class CommentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for comments.

    list: GET /api/comments/ - List all comments
    create: POST /api/comments/ - Add a new comment
    retrieve: GET /api/comments/{id}/ - Get a single comment
    update: PUT /api/comments/{id}/ - Update a comment
    partial_update: PATCH /api/comments/{id}/ - Partially update a comment
    destroy: DELETE /api/comments/{id}/ - Delete a comment
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        # Set author to Admin and current time if not provided
        if 'author' not in data:
            data['author'] = 'Admin'
        if 'date' not in data:
            data['date'] = timezone.now().isoformat()
        if 'likes' not in data:
            data['likes'] = 0

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
