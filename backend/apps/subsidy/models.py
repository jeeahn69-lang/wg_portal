from django.db import models

class Subsidy(models.Model):
    title = models.CharField(max_length=200, verbose_name="지원 사업명")
    amount = models.IntegerField(verbose_name="지원 금액")
    target_village = models.ForeignKey('village.Village', on_delete=models.CASCADE, verbose_name="대상 마을")
    is_approved = models.BooleanField(default=False, verbose_name="승인 여부")

    def __str__(self):
        return self.title