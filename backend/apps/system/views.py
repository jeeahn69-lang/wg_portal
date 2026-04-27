from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db.models import Q
from django.views.decorators.http import require_http_methods  # 추가 공통코드등록 버튼 클릭시 
from django.views.decorators.csrf import csrf_exempt
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
        'system/ComCodeList',
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


@login_required
@csrf_exempt # CSRF 검증을 우회 (주의: 실제 배포 시에는 적절한 CSRF 보호 방법을 사용해야 합니다)
@require_http_methods(["POST"])
def comcode_create(request):
    """공통코드 대분류 등록"""
    
    try:
        # ✅ JSON 형식의 요청 데이터 파싱
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': '요청 데이터 형식이 올바르지 않습니다.'
            }, status=400)
        
        master_cd = data.get('master_cd', '').strip()
        master_nm = data.get('master_nm', '').strip()
        use_yn    = data.get('use_yn', 'Y').strip()
        remarks   = data.get('remarks', '').strip()
 
        # ── 유효성 검사 ──────────────────────────────────────
        errors = {}
 
        if not master_cd:
            errors['master_cd'] = '코드를 입력하세요.'
        elif len(master_cd) > 50:
            errors['master_cd'] = '코드는 50자 이하로 입력하세요.'
 
        if not master_nm:
            errors['master_nm'] = '코드명을 입력하세요.'
        elif len(master_nm) > 100:
            errors['master_nm'] = '코드명은 100자 이하로 입력하세요.'
 
        if use_yn not in ('Y', 'N'):
            errors['use_yn'] = '사용여부 값이 올바르지 않습니다.'
 
        if errors:
            return JsonResponse({'success': False, 'errors': errors}, status=422)
 
        # ── 중복 체크 ─────────────────────────────────────────
        if CommonCodeMas.objects.filter(master_cd=master_cd).exists():
            return JsonResponse({
                'success': False,
                'errors': {'master_cd': f"'{master_cd}' 코드가 이미 존재합니다."}
            }, status=409)
 
        # ── DB 저장 ───────────────────────────────────────────
        # created_at, updated_at은 auto_now_add/auto_now에 의해 자동 설정됨
        CommonCodeMas.objects.create(
            master_cd=master_cd,
            master_nm=master_nm,
            use_yn=use_yn,
            remarks=remarks,
        )
 
        return JsonResponse({
            'success': True,
            'message': f"'{master_nm}' 코드가 등록되었습니다.",
        }, status=201)
 
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'오류가 발생했습니다: {str(e)}'
        }, status=500)