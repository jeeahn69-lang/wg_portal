# # backend\urls.py (프로젝트 메인 urls)
# from django.contrib import admin
# from django.urls import path, include
# from . import views

# app_name = 'accounts' # 이걸 적어주면 다른 곳에서 'accounts:login'으로 부를 수 있습니다.

# urlpatterns = [
#     path('admin/', admin.site.urls),
    
#     # 1. 주소창에 아무것도 안 쳤을 때 (http://127.0.0.1:8000/) 실행될 경로
#     path('', views.index, name='index'), 
    
#     # 2. backend\app\urls.py 에 정의된 나머지 경로들을 포함 (accounts/login 등)
#     path('accounts/', include('app.urls')), 
# ]

from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # 로그인 페이지
    path('login/', views.login_page, name='login'),
    # 로그인 처리 (POST)
    path('login/action/', views.login_action, name='login_action'),
    # 로그아웃
    path('logout/', views.logout_action, name='logout'),
]
