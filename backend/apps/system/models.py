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


class CommonCodeMas(models.Model):
    """공통코드 대분류 테이블 (sy_comcode_bas)"""
    master_cd = models.CharField(max_length=20, unique=True, verbose_name="대분류 코드", primary_key=True)
    master_nm = models.CharField(max_length=100, verbose_name="대분류명")
    use_yn = models.CharField(max_length=1, choices=[('Y', '사용'), ('N', '미사용')], default='Y', verbose_name="사용여부")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="생성일")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="수정일")

    class Meta:
        verbose_name = "공통코드 대분류"
        verbose_name_plural = "공통코드 대분류"
        db_table = 'sy_comcode_bas'

    def __str__(self):
        return f"[{self.master_cd}] {self.master_nm}"


class CommonCodeDtl(models.Model):
    """공통코드 소분류 테이블 (sy_comcode_dtl)"""
    master_cd = models.ForeignKey(CommonCodeMas, on_delete=models.CASCADE, verbose_name="대분류 코드", db_column='master_cd')
    dtl_cd = models.CharField(max_length=20, verbose_name="소분류 코드")
    dtl_nm = models.CharField(max_length=100, verbose_name="소분류명")
    sort_ord = models.IntegerField(default=0, verbose_name="정렬순서")
    use_yn = models.CharField(max_length=1, choices=[('Y', '사용'), ('N', '미사용')], default='Y', verbose_name="사용여부")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="생성일")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="수정일")

    class Meta:
        verbose_name = "공통코드 소분류"
        verbose_name_plural = "공통코드 소분류"
        db_table = 'sy_comcode_dtl'
        unique_together = [['master_cd', 'dtl_cd']]
        ordering = ['sort_ord']

    def __str__(self):
        return f"[{self.master_cd}/{self.dtl_cd}] {self.dtl_nm}"


class CommonCode(models.Model):
    group_code = models.CharField(max_length=20, verbose_name="그룹코드")
    code = models.CharField(max_length=20, verbose_name="상세코드")
    code_name = models.CharField(max_length=100, verbose_name="코드명")
    is_use = models.BooleanField(default=True, verbose_name="사용여부")

    def __str__(self):
        return f"[{self.group_code}] {self.code_name}"