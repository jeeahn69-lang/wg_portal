# """
# URL configuration for config project.

from django.contrib import admin # 1. admin 가져오기 추가
from django.urls import path, include
from apps.village import views as village_views
from apps.accounts import views as account_views

urlpatterns = [
    path('admin/', admin.site.urls), # 2. 관리자 페이지 경로 추가
    path('accounts/', include('apps.accounts.urls')),
    path('', account_views.index, name='index'),
    # path('', views.index, name='index'),
    path('village/', village_views.village_list),
    path('village/', include('apps.village.urls')),
    
]