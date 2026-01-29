from django.db import models


class Comment(models.Model):
    author = models.CharField(max_length=100)
    text = models.TextField()
    date = models.DateTimeField()
    likes = models.IntegerField(default=0)
    image = models.URLField(max_length=500, blank=True, default='')
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.author}: {self.text[:50]}..."
