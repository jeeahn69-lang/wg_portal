from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    title = models.CharField(max_length=200, verbose_name="제목")
    content = models.TextField(verbose_name="내용")
    author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="작성자")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title