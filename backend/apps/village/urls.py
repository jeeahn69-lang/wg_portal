# backend/apps/village/urls.py
from django.urls import path

# from concurrent.interpreters import create
from . import views

urlpatterns = [
    # 1. 대시보드 (views.dashboard 존재 확인)
    path('dashboard/', views.dashboard, name='village_dashboard'),
    
    # 2. 마을 목록
    path('list/', views.village_list, name='village_list'),

    # 3. 보조금 관리
    path('subsidy/', views.subsidy_list, name='subsidy_list'),

    # 4. 업무 보고 (views.py에 work_list가 없으므로 board_list를 연결하거나 함수명을 통일해야 함)
    # views.py에서 'BoardList'를 렌더링하는 함수가 board_list이므로 이를 사용합니다.
    path('work/', views.board_list, name='work_list'), 

    # 5. 시스템 관리 (views.py에 정의되어 있는지 확인 필요)
    # path('system/', views.system_list, name='system_list'),

    # 6. 마을관리카드 (슬래시(/) 추가로 경로 일관성 유지)
    # path('card/', views.village_card, name='village_card'),
    # [2026-06-05] 마을관리카드 API 경로를 '/village/create/'로 변경하여, 프론트엔드에서 해당 경로로 요청할 수 있도록 수정합니다.
    path('create/', views.village_create, name='village_create'),


    # 7. 마을정보관리 (슬래시(/) 추가로 경로 일관성 유지)
    # path('vlinfo/', views.village_info, name='village_info'),
    path('vlinfo/', views.village_info_list, name='village_info_list'),
    path('purposes/', views.establishment_purposes, name='establishment_purposes'),
    path('establishment-types/', views.establishment_types, name='establishment_types'),
    path('corporation-types/', views.corporation_types, name='corporation_types'),
    path('repactivity-types/', views.repactivity_types, name='repactivity_types'),
    path('workactivity-types/', views.workactivity_types, name='workactivity_types'),
    path('info-search-api/', views.village_info_search_api, name='village_info_search_api'),
    # 2026-05-26 추가: 단일 마을 상세조회 API
    path('info-detail-api/<str:vil_mng_no>/', views.village_info_detail_api, name='village_info_detail_api'),

    # 9. 마을매출정보
    path('sales/', views.village_sales, name='village_sales'),

    # 8. 게시판 목록
    path('board/', views.board_list, name='board_list'),


]