from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'author', 'text', 'date', 'likes', 'image', 'parent', 'replies']
        read_only_fields = ['id']

    def get_replies(self, obj):
        # Only fetch replies for top-level comments to avoid N+1 queries on deeply nested
        if obj.parent is None:
            replies = obj.replies.all()
            return CommentSerializer(replies, many=True).data
        return []
