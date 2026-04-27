from django.urls import path
from . import views

app_name = 'system'

urlpatterns = [
    path('comcode/', views.comcode_manager, name='comcode_manager'),
    path('comcode/detail/<str:master_cd>/', views.get_detail_codes, name='get_detail_codes'),
    path('comcode/create/', views.comcode_create, name='comcode_create'),
]
