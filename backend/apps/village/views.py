from django.shortcuts import render
from inertia import render as inertia_render
from urllib3 import request
from .models import Village
from django.db import models
from django.db import connection
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

def village_list(request):
    villages = list(Village.objects.values())

    return inertia_render(request, 'village/List', {
        'villages': villages
    })

def village_card(request):
    # 'village/VillageInfoCreate'는 Pages/village/VillageCard.jsx 파일을 의미합니다.
    return inertia_render(request, 'village/VillageInfoCreate')

def village_info(request):
    # 'village/VillageInfoCreate'는 Pages/village/VillageInfoCreate.jsx 파일을 의미합니다.
    # return inertia_render(request, 'village/VillageInfoCreate')
    return inertia_render(request, 'village/VillageInfoList')

def village_sales(request):
    return inertia_render(request, 'village/VillageSalesList')

def dashboard(request):
    # 'village/Dashboard'는 Pages/village/Dashboard.jsx 파일을 의미합니다.
    return inertia_render(request, 'village/Dashboard')

def subsidy_list(request):
    # 'village/SubsidyList'는 프론트엔드 Pages 폴더 내 해당 컴포넌트 경로입니다.
    return inertia_render(request, 'village/SubsidyList')

def board_list(request): #BoardList_list(request):
    # 'village/SubsidyList'는 프론트엔드 Pages 폴더 내 해당 컴포넌트 경로입니다.
    return inertia_render(request, 'village/BoardList')

def _fetch_comcode_by_master(master_cd):
    """공통코드 소분류 목록 조회"""
    query = """
        SELECT dtl_cd, dtl_nm
        FROM sys_comcode_dtl
        WHERE master_cd = %s AND use_yn = 'Y'
        ORDER BY dtl_cd ASC
    """
    with connection.cursor() as cursor:
        cursor.execute(query, [master_cd])
        rows = cursor.fetchall()
    
        return [{'code': row[0], 'name': row[1]} for row in rows]



@require_http_methods(["GET"])
def establishment_purposes(request):
    """설립목적 콤보박스용 JSON API"""
    return JsonResponse(_fetch_comcode_by_master('BC0001'), safe=False)

@require_http_methods(["GET"])
def establishment_types(request):
    """설립유형(BC0002) 콤보박스용 JSON API"""
    return JsonResponse(_fetch_comcode_by_master('BC0002'), safe=False)

@require_http_methods(["GET"])
def corporation_types(request):
    """법인유형(BC0003) 콤보박스용 JSON API"""
    return JsonResponse(_fetch_comcode_by_master('BC0003'), safe=False)

@require_http_methods(["GET"])
def repactivity_types(request):
    """대표자 활동유형(BC0004) 콤보박스용 JSON API"""
    return JsonResponse(_fetch_comcode_by_master('BC0004'), safe=False)

@require_http_methods(["GET"])
def workactivity_types(request):
    """실무자 활동유형(BC0004) 콤보박스용 JSON API"""
    return JsonResponse(_fetch_comcode_by_master('BC0004'), safe=False)

def village_info_create(request):
    """마을 정보 등록 화면 렌더링 (공통코드 초기값 포함)"""
    return inertia_render(request, 'village/VillageInfoCreate', {
        'purposes': _fetch_comcode_by_master('BC0001'),
        'establishmentTypes': _fetch_comcode_by_master('BC0002'),
        'corporationTypes': _fetch_comcode_by_master('BC0003'),
        'repactivityTypes': _fetch_comcode_by_master('BC0004'),
        'workactivityTypes': _fetch_comcode_by_master('BC0004'),
    })

 