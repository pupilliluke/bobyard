from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Comment
from .serializers import CommentSerializer


class CommentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for comments.

    list: GET /api/comments/ - List all comments (top-level only, replies nested)
    create: POST /api/comments/ - Add a new comment (use parent field for replies)
    retrieve: GET /api/comments/{id}/ - Get a single comment
    update: PUT /api/comments/{id}/ - Update a comment
    partial_update: PATCH /api/comments/{id}/ - Partially update a comment
    destroy: DELETE /api/comments/{id}/ - Delete a comment
    delete_all: DELETE /api/comments/delete_all/ - Delete all comments
    """
    serializer_class = CommentSerializer

    @action(detail=False, methods=['delete'])
    def delete_all(self, request):
        """Delete all comments and return them for undo"""
        # Get all comments before deleting (for undo)
        comments = list(Comment.objects.all().values(
            'id', 'author', 'text', 'date', 'likes', 'image', 'parent_id'
        ))
        count = len(comments)
        Comment.objects.all().delete()
        return Response({'deleted': count, 'comments': comments}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def restore(self, request):
        """Restore previously deleted comments"""
        comments_data = request.data.get('comments', [])
        restored = 0
        # First pass: create comments without parents
        for data in comments_data:
            Comment.objects.create(
                id=data['id'],
                author=data['author'],
                text=data['text'],
                date=data['date'],
                likes=data['likes'],
                image=data.get('image', ''),
            )
            restored += 1
        # Second pass: set parent relationships
        for data in comments_data:
            if data.get('parent_id'):
                comment = Comment.objects.get(id=data['id'])
                comment.parent_id = data['parent_id']
                comment.save()
        return Response({'restored': restored}, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        # For list view, only return top-level comments (replies are nested in serializer)
        if self.action == 'list':
            return Comment.objects.filter(parent__isnull=True)
        return Comment.objects.all()

    def create(self, request, *args, **kwargs):
        # Build data dict with defaults
        data = {
            'author': request.data.get('author', 'Admin'),
            'text': request.data.get('text', ''),
            'date': request.data.get('date', timezone.now().isoformat()),
            'likes': request.data.get('likes', 0),
            'image': request.data.get('image', ''),
        }
        # Only include parent if provided
        if 'parent' in request.data and request.data['parent']:
            data['parent'] = request.data['parent']

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
