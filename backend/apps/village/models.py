from django.db import models

class Village(models.Model):
    name = models.CharField(max_length=100, verbose_name="마을명")
    address = models.CharField(max_length=255, verbose_name="주소")
    leader_name = models.CharField(max_length=50, verbose_name="이장님 성함")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name