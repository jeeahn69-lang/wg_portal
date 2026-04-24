# """
# URL configuration for config project.

# from django.contrib import admin # 1. admin 가져오기 추가
# from django.urls import path, include
# from apps.village import views as village_views
# from apps.accounts import views as account_views

# urlpatterns = [
#     path('admin/', admin.site.urls), # 2. 관리자 페이지 경로 추가
#     path('accounts/', include('apps.accounts.urls')),
#     path('', account_views.index, name='index'),
#     # path('', views.index, name='index'),
#     path('village/', village_views.village_list),
#     path('village/', include('apps.village.urls')),
    
# ]

from django.contrib import admin
from django.urls import path, include
from apps.accounts import views as account_views

# URL 구성
# ============================================================
# 루트 경로('') → 대시보드 (메인 페이지, 로그인 필수)
# 로그인하지 않은 사용자는 자동으로 /accounts/login/으로 리다이렉트됨
# ============================================================

urlpatterns = [
    # 관리자 페이지
    path('admin/', admin.site.urls),
    
    # ============================================================
    # 루트 경로('') → 대시보드 (로그인 필수)
    # @login_required로 보호되어 있음
    # ============================================================
    path('', account_views.dashboard_view, name='index'),
    
    # ============================================================
    # 계정 관련 URL (/accounts/...)
    # /accounts/login/, /accounts/login/action/, /accounts/logout/ 등
    # ============================================================
    path('accounts/', include('apps.accounts.urls')),
    # 마을 관리 URL (/village/...)
    # ============================================================
    path('village/', include('apps.village.urls')),
    # 시스템 관리 URL (/system/...)
    # ============================================================
    path('system/', include('apps.system.urls')),
]