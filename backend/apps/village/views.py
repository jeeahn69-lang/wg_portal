from django.shortcuts import render
from inertia import render as inertia_render
from urllib3 import request
from .models import Village
from django.db import models
from django.db import connection

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


# def village_info_create(request):
#     """
#     마을 정보 등록 화면을 렌더링하면서 설립목적 공통코드(BC001) 목록을 함께 전달
#     """
#     query = """
#         SELECT dtl_cd, dtl_nm 
#         FROM sys_comcode_dtl 
#         WHERE master_cd = 'BC001' AND use_yn = 'Y'
#         ORDER BY dtl_cd ASC
#     """
    
#     with connection.cursor() as cursor:
#         cursor.execute(query)
#         rows = cursor.fetchall()
    
#     # React(Props)로 보낼 데이터 포맷 가공
#     purposes = [{'code': row[0], 'name': row[1]} for row in rows]
    
#     # Inertia를 통해 화면을 열 때 'purposes' 데이터를 담아서 던져줍니다.
#     return inertia_render(request, 'village/VillageInfoCreate', {
#         'purposes': purposes
#     })
