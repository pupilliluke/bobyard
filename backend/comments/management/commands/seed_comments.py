import json
from pathlib import Path
from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime
from comments.models import Comment


class Command(BaseCommand):
    help = 'Seed the database with initial comments from JSON file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing comments before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            Comment.objects.all().delete()
            self.stdout.write(self.style.WARNING('Cleared all existing comments'))

        # Find the JSON file
        json_path = Path(__file__).resolve().parent.parent.parent.parent.parent / 'Copy of comments.json'

        if not json_path.exists():
            self.stdout.write(self.style.ERROR(f'JSON file not found at {json_path}'))
            return

        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        comments_data = data.get('comments', [])
        created_count = 0

        # First pass: create all comments without parents
        for comment_data in comments_data:
            Comment.objects.update_or_create(
                id=int(comment_data['id']),
                defaults={
                    'author': comment_data['author'],
                    'text': comment_data['text'],
                    'date': parse_datetime(comment_data['date']),
                    'likes': comment_data['likes'],
                    'image': comment_data.get('image', ''),
                }
            )
            created_count += 1

        # Second pass: set parent relationships
        for comment_data in comments_data:
            if 'parent' in comment_data and comment_data['parent']:
                comment = Comment.objects.get(id=int(comment_data['id']))
                comment.parent_id = int(comment_data['parent'])
                comment.save()

        self.stdout.write(
            self.style.SUCCESS(f'Successfully seeded {created_count} comments')
        )
