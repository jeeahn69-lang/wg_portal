from django.urls import path
from . import views

app_name = 'system'

urlpatterns = [
    path('comcode/', views.comcode_manager, name='comcode_manager'),
    path('comcode/detail/<str:master_cd>/', views.get_detail_codes, name='get_detail_codes'),
    path('comcode/create/', views.comcode_create, name='comcode_create'),
    
    # 상세코드(DetailCode) API
    path('comcode/detail/create/', views.comcode_detail_create, name='comcode_detail_create'),
    path('comcode/detail/update/', views.comcode_detail_update, name='comcode_detail_update'),
    path('comcode/detail/delete/<int:dtl_idx>/', views.comcode_detail_delete, name='comcode_detail_delete'),
]
