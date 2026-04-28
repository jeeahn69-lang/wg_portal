from django.urls import path
from . import views

app_name = 'system'

urlpatterns = [
    path('comcode/', views.comcode_manager, name='comcode_manager'),
    path('comcode/create/', views.comcode_create, name='comcode_create'),
    path('comcode/master/delete/<str:master_cd>/', views.comcode_master_delete, name='comcode_master_delete'),


    # 상세코드(DetailCode) API - 구체적인 패턴을 먼저 배치
    path('comcode/detail/create/', views.comcode_detail_create, name='comcode_detail_create'),
    path('comcode/detail/update/', views.comcode_detail_update, name='comcode_detail_update'),
    path('comcode/detail/delete/<int:dtl_idx>/', views.comcode_detail_delete, name='comcode_detail_delete'),
    
    # 일반 조회 - 가변 매개변수 패턴을 마지막에 배치
    path('comcode/detail/<str:master_cd>/', views.get_detail_codes, name='get_detail_codes'),
]
