#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.system.models import CommonCodeMas, CommonCodeDtl
from django.db.models import Q

print("=" * 60)
print("✅ Django ORM 쿼리 테스트")
print("=" * 60)

# 테스트 1: 대분류 조회
try:
    master_list = list(CommonCodeMas.objects.all().values(
        'master_cd',
        'master_nm',
        'use_yn'
    ).order_by('master_cd'))
    print(f"\n✅ 대분류 조회 성공: {len(master_list)}개")
    for m in master_list:
        print(f"   - {m}")
except Exception as e:
    print(f"❌ 대분류 조회 실패: {str(e)}")

# 테스트 2: 소분류 조회 (master_cd_id 사용)
try:
    detail_list = list(CommonCodeDtl.objects.all().values(
        'master_cd_id',
        'dtl_cd',
        'dtl_nm',
        'sort_ord',
        'use_yn'
    ).order_by('sort_ord'))
    print(f"\n✅ 소분류 조회 성공: {len(detail_list)}개")
    for d in detail_list[:5]:  # 처음 5개만 출력
        print(f"   - {d}")
except Exception as e:
    print(f"❌ 소분류 조회 실패: {str(e)}")

# 테스트 3: 필터링 쿼리
try:
    search_results = list(CommonCodeMas.objects.filter(
        Q(master_cd__icontains='GEN') | Q(master_nm__icontains='성')
    ).values('master_cd', 'master_nm', 'use_yn'))
    print(f"\n✅ 필터링 조회 성공: {len(search_results)}개")
    for s in search_results:
        print(f"   - {s}")
except Exception as e:
    print(f"❌ 필터링 조회 실패: {str(e)}")

# 테스트 4: FK 관계 조회
try:
    if CommonCodeMas.objects.exists():
        first_master = CommonCodeMas.objects.first()
        related_details = list(CommonCodeDtl.objects.filter(
            master_cd=first_master
        ).values('dtl_cd', 'dtl_nm', 'use_yn'))
        print(f"\n✅ FK 관계 조회 성공 ({first_master.master_cd}): {len(related_details)}개")
        for d in related_details:
            print(f"   - {d}")
except Exception as e:
    print(f"❌ FK 관계 조회 실패: {str(e)}")

print("\n" + "=" * 60)
print("✅ 모든 테스트 완료!")
print("=" * 60)
