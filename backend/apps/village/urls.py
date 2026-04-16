# backend/apps/village/urls.py
from django.urls import path
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
    path('card/', views.village_card, name='village_card'),

    # 7. 게시판 목록
    path('board/', views.board_list, name='board_list'),
]