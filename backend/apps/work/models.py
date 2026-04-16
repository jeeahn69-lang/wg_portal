from django.db import models
from django.contrib.auth.models import User

class VillageWork(models.Model):
    # 'village' 앱의 Village 모델과 연결 (문자열로 참조)
    village = models.ForeignKey('village.Village', on_delete=models.CASCADE, verbose_name="해당 마을")
    title = models.CharField(max_length=200, verbose_name="업무/활동명")
    content = models.TextField(verbose_name="상세 내용")
    work_date = models.DateField(verbose_name="활동 일자")
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name="담당자")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "마을 업무"
        verbose_name_plural = "마을 업무 목록"

    def __str__(self):
        return f"{self.village.name} - {self.title}"