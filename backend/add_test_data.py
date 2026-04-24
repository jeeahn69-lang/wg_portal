#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.system.models import CommonCodeMas, CommonCodeDtl

# 기존 데이터 확인
if CommonCodeMas.objects.exists():
    print("✅ 이미 테스트 데이터가 존재합니다.")
    print(f"대분류: {CommonCodeMas.objects.count()}개")
    print(f"소분류: {CommonCodeDtl.objects.count()}개")
else:
    # 테스트 데이터: 대분류 추가
    masters = [
        CommonCodeMas(master_cd='GENDER', master_nm='성별', use_yn='Y'),
        CommonCodeMas(master_cd='REGION', master_nm='지역', use_yn='Y'),
        CommonCodeMas(master_cd='STATUS', master_nm='상태', use_yn='Y'),
    ]
    for m in masters:
        m.save()

    # 테스트 데이터: 소분류 추가
    details = [
        CommonCodeDtl(master_cd_id='GENDER', dtl_cd='M', dtl_nm='남성', sort_ord=1, use_yn='Y'),
        CommonCodeDtl(master_cd_id='GENDER', dtl_cd='F', dtl_nm='여성', sort_ord=2, use_yn='Y'),
        CommonCodeDtl(master_cd_id='REGION', dtl_cd='SEOUL', dtl_nm='서울', sort_ord=1, use_yn='Y'),
        CommonCodeDtl(master_cd_id='REGION', dtl_cd='BUSAN', dtl_nm='부산', sort_ord=2, use_yn='Y'),
        CommonCodeDtl(master_cd_id='STATUS', dtl_cd='ACTIVE', dtl_nm='활성', sort_ord=1, use_yn='Y'),
        CommonCodeDtl(master_cd_id='STATUS', dtl_cd='INACTIVE', dtl_nm='비활성', sort_ord=2, use_yn='Y'),
    ]
    for d in details:
        d.save()

    print("✅ 테스트 데이터 추가 완료!")
    print(f"대분류: {CommonCodeMas.objects.count()}개")
    print(f"소분류: {CommonCodeDtl.objects.count()}개")
