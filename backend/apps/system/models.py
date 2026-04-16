from django.db import models

class SystemConfig(models.Model):
    key = models.CharField(max_length=50, unique=True, verbose_name="설정 키")
    value = models.TextField(verbose_name="설정 값")
    description = models.CharField(max_length=200, blank=True, verbose_name="설명")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "시스템 설정"
        verbose_name_plural = "시스템 설정 목록"

    def __str__(self):
        return self.key

class CommonCode(models.Model):
    group_code = models.CharField(max_length=20, verbose_name="그룹코드")
    code = models.CharField(max_length=20, verbose_name="상세코드")
    code_name = models.CharField(max_length=100, verbose_name="코드명")
    is_use = models.BooleanField(default=True, verbose_name="사용여부")

    def __str__(self):
        return f"[{self.group_code}] {self.code_name}"