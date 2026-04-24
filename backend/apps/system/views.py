from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db.models import Q
from inertia import render as inertia_render
from .models import CommonCodeMas, CommonCodeDtl, CommonCode
import json


@login_required
def comcode_manager(request):
    """공통코드 관리 페이지 - 대분류 및 소분류 코드 조회"""
    
    # GET 파라미터에서 검색 조건 받기
    master_cd = request.GET.get('master_cd', '').strip()
    master_nm = request.GET.get('master_nm', '').strip()
    
    # 기본 쿼리: 대분류 조회
    master_queryset = CommonCodeMas.objects.all()
    
    # 검색 조건 적용
    if master_cd or master_nm:
        query = Q()
        if master_cd:
            query |= Q(master_cd__icontains=master_cd)
        if master_nm:
            query |= Q(master_nm__icontains=master_nm)
        master_queryset = master_queryset.filter(query)
    
    # 대분류 리스트 (sy_comcode_bas)
    master_list = list(master_queryset.values(
        'master_cd',
        'master_nm',
        'use_yn'
    ).order_by('master_cd'))
    
    # 소분류 리스트 전체 (sy_comcode_dtl)
    detail_list = list(CommonCodeDtl.objects.all().values(
        'master_cd_id',
        'dtl_cd',
        'dtl_nm',
        'sort_ord',
        'use_yn'
    ).order_by('sort_ord'))
    
    return inertia_render(
        request,
        'system/Comcodemanager',
        {
            'masterList': master_list,
            'detailList': detail_list,
            'searchParams': {
                'master_cd': master_cd,
                'master_nm': master_nm,
            }
        }
    )


@login_required
def get_detail_codes(request, master_cd):
    """특정 대분류에 속하는 소분류 코드 조회 (AJAX API)"""
    
    try:
        # 요청한 대분류가 존재하는지 확인
        master = CommonCodeMas.objects.get(master_cd=master_cd)
        
        # 해당 대분류의 소분류 조회
        details = list(CommonCodeDtl.objects.filter(
            master_cd=master_cd
        ).values(
            'dtl_cd',
            'dtl_nm',
            'sort_ord',
            'use_yn'
        ).order_by('sort_ord'))
        
        return JsonResponse({
            'success': True,
            'data': details,
            'message': f'{master.master_nm}의 소분류 코드를 조회했습니다.'
        })
    
    except CommonCodeMas.DoesNotExist:
        return JsonResponse({
            'success': False,
            'data': [],
            'message': '해당 대분류 코드를 찾을 수 없습니다.'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'data': [],
            'message': f'오류 발생: {str(e)}'
        }, status=500)
