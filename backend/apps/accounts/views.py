from django.shortcuts import redirect
from django.http import HttpResponse
from inertia import render as inertia_render
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.cache import cache_control
from django.views.decorators.http import require_http_methods
import json

# ============================================================
# 캐시 방지 설정: 모든 인증/비인증 페이지에서 캐시 금지
# ============================================================

@cache_control(no_cache=True, no_store=True, must_revalidate=True, max_age=0)
@require_http_methods(["GET", "POST"])
def login_page(request):
    """
    로그인 페이지 렌더링
    
    로직:
    1. 로그인된 사용자 → /로 리다이렉트 (대시보드)
    2. 로그인하지 않은 사용자 → Login.jsx 페이지 렌더링
    """
    # 로그인된 사용자는 즉시 대시보드(루트)로 이동
    if request.user.is_authenticated:
        return redirect('index')
    
    # 로그인하지 않은 사용자에게 Login 페이지 표시
    # 세션에서 에러 메시지 팝 (있으면 표시, 없으면 빈 dict)
    errors = request.session.pop('errors', {})
    
    return inertia_render(request, 'Auth/Login', props={
        'errors': errors,
    })


@cache_control(no_cache=True, no_store=True, must_revalidate=True, max_age=0)
@require_http_methods(["POST"])
def login_action(request):
    """
    로그인 처리 로직
    
    처리:
    1. admin/ad1234 → Django auth_login 사용해서 로그인 후 대시보드로 이동
    2. DB 인증 성공 → 세션 생성 후 대시보드로 이동
    3. 인증 실패 → 에러 메시지와 함께 로그인 페이지로 리다이렉트
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        request.session['errors'] = {'auth': '요청 형식이 올바르지 않습니다.'}
        return redirect('index')
    
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    
    # 입력값 검증
    if not username or not password:
        request.session['errors'] = {'auth': '아이디와 비밀번호를 입력해주세요.'}
        return redirect('index')
    
    # 1. 테스트 계정 확인 (admin/ad1234)
    if username == 'admin' and password == 'ad1234':
        # Django 인증을 사용해서 로그인 처리
        try:
            # 기존 admin 계정이 있으면 로그인
            user = User.objects.get(username='admin')
            auth_login(request, user)  # ✅ auth_login 사용 (request.user 설정)
        except User.DoesNotExist:
            # admin 계정이 없으면 새로 생성
            user = User.objects.create_user(username='admin', password='ad1234')
            auth_login(request, user)  # ✅ auth_login 사용 (request.user 설정)
        
        request.session.modified = True  # 세션 저장 강제
        return redirect('/')
    
    # 2. DB 유저 인증 시도
    user = authenticate(request, username=username, password=password)
    if user is not None:
        auth_login(request, user)
        request.session.modified = True  # 세션 저장 강제
        return redirect('/')
    
    # 3. 인증 실패
    request.session['errors'] = {'auth': '아이디 or 비밀번호를 확인해 주세요'}
    request.session.modified = True  # 세션 저장 강제
    return redirect('index')


@cache_control(no_cache=True, no_store=True, must_revalidate=True, max_age=0)
@require_http_methods(["GET"])
def logout_action(request):
    """
    로그아웃 처리
    
    처리:
    1. 세션 및 쿠키 정리
    2. 브라우저/서버 캐시 완전 삭제
    3. 로그인 페이지(루트)로 리다이렉트
    """
    # 1. Django 로그아웃 (세션 삭제)
    logout(request)
    request.session.flush()  # 세션 완전 정리
    
    # 2. 루트 경로로 리다이렉트하는 응답 생성
    response = redirect('index')
    
    # 3. 캐시 관련 HTTP 헤더 추가 (강력한 캐시 제거)
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    
    # 4. 브라우저 쿠키 제거 헤더 추가
    response.delete_cookie('sessionid')  # Django 세션 쿠키
    response.delete_cookie('XSRF-TOKEN')  # CSRF 토큰
    
    return response


@cache_control(no_cache=True, no_store=True, must_revalidate=True, max_age=0)
@login_required(login_url='accounts:login')  # 로그인하지 않은 사용자는 /accounts/login/으로 리다이렉트
@require_http_methods(["GET"])
def dashboard_view(request):
    """
    대시보드 페이지 (로그인 필수)
    
    접근 조건:
    - login_required 데코레이터로 인해 로그인된 사용자만 접근 가능
    - 로그인하지 않은 사용자는 자동으로 로그인 페이지(루트)로 리다이렉트
    """
    return inertia_render(request, 'village/Dashboard', props={
        'user': {
            'username': request.user.username if request.user.is_authenticated else '관리자'
        }
    })

