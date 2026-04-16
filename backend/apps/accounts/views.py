from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from inertia import render
import json

def index(request):
    """메인 페이지: 로그인 여부를 확인하여 대시보드 또는 로그인 페이지로 보냄"""
    if not request.user.is_authenticated:
        # urls.py의 app_name='accounts'와 path name='login' 확인
        return redirect('accounts:login')

    return render(request, 'village/Dashboard')


def login_page(request):
    """GET 요청 시 로그인 화면을 보여줌"""
    # 이미 로그인한 사용자라면 메인으로 보냄
    if request.user.is_authenticated:
        return redirect('index')

    return render(request, 'Auth/Login', props={
        'title': '완주군 마을 통합 포털',
        'event': 'Wanju Project Start!'
    })

def login_action(request):
    if request.method == 'POST':
        # 1. Inertia/React에서 보낸 데이터 읽기
        try:
            # request.POST에 데이터가 없다면 JSON body에서 가져옵니다.
            if not request.POST:
                data = json.loads(request.body)
                username = data.get('username')
                password = data.get('password')
            else:
                username = request.POST.get('username')
                password = request.POST.get('password')
        except Exception:
            return render(request, 'Auth/Login', props={'error': '데이터 형식이 잘못되었습니다.'})

        print(f"로그인 시도 아이디: {username}") # 이제 None이 아니어야 합니다!

        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            print(f"로그인 성공: {username}")
            return redirect('/') 
        else:
            print("로그인 실패: 인증 정보 불일치")
            return render(request, 'Auth/Login', props={
                'errors': {'error': '아이디 또는 비밀번호가 올바르지 않습니다.'}
            })

    return redirect('accounts:login')

def logout_action(request):
    """로그아웃 처리"""
    logout(request)
    return redirect('accounts:login')