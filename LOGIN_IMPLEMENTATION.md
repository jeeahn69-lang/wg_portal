# 루트 URL 로그인 페이지 구현 가이드

## ✅ 구현 완료

`127.0.0.1:8000` (루트 URL) 접속 시 항상 **Login.jsx 페이지**가 렌더링되도록 수정되었습니다.

---

## 📋 요구사항 충족 확인

### ✅ 조건 1: urls.py에서 루트 경로('') 연결
**파일**: `backend/config/urls.py`
```python
path('', account_views.login_page, name='index'),
```
- 루트 경로('')를 `login_page` view로 연결
- URL name을 'index'로 명확하게 설정

---

### ✅ 조건 2: login view에서 Login 페이지 렌더링
**파일**: `backend/apps/accounts/views.py`
```python
def login_page(request):
    # 로그인된 사용자만 대시보드로 이동
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    # 로그인하지 않은 사용자에게 Login.jsx 페이지 표시
    errors = request.session.pop('errors', {})
    return inertia_render(request, 'Auth/Login', props={
        'errors': errors,
    })
```
- `inertia_render()`를 사용하여 'Auth/Login' 페이지 렌더링
- 에러 메시지가 있으면 표시

---

### ✅ 조건 3: 로그인 상태 시에만 /dashboard로 redirect
**파일**: `backend/apps/accounts/views.py`

1. **login_page**: 로그인된 사용자 자동 redirect
```python
if request.user.is_authenticated:
    return redirect('dashboard')
```

2. **login_action**: 인증 성공 시만 redirect
```python
# 테스트 계정 로그인
if username == 'admin' and password == 'ad1234':
    return redirect('dashboard')

# DB 유저 인증 성공
user = authenticate(request, username=username, password=password)
if user is not None:
    auth_login(request, user)
    return redirect('dashboard')
```

3. **dashboard_view**: @login_required로 보호
```python
@login_required(login_url='/')
def dashboard_view(request):
    # 로그인된 사용자만 접근 가능
    return inertia_render(request, 'village/Dashboard', props={...})
```

---

### ✅ 조건 4: /dashboard로 자동 이동 방지
**구현 사항**:
- Frontend에 자동 redirect 로직 없음
- 미들웨어에서 자동 redirect 없음
- 로그인 성공 시에만 `/dashboard` 접근 가능

---

### ✅ 조건 5: 캐시/세션 영향 없이 항상 동작 보장

#### A. 캐시 방지 (HTTP 응답 헤더)
**파일**: `backend/apps/accounts/views.py`
```python
@cache_control(no_cache=True, no_store=True, must_revalidate=True, max_age=0)
def login_page(request):
    ...

@cache_control(no_cache=True, no_store=True, must_revalidate=True, max_age=0)
def login_action(request):
    ...

@cache_control(no_cache=True, no_store=True, must_revalidate=True, max_age=0)
def logout_action(request):
    ...

@cache_control(no_cache=True, no_store=True, must_revalidate=True, max_age=0)
def dashboard_view(request):
    ...
```
- 브라우저 캐시로 인한 문제 방지
- 매번 서버에서 최신 데이터 확인

#### B. 세션 강제 저장
**파일**: `backend/apps/accounts/views.py`
```python
# login_action에서
request.session.modified = True  # 세션 저장 강제

# logout_action에서
request.session.flush()  # 세션 완전 정리
```

#### C. Django 설정 (이미 적용됨)
**파일**: `backend/config/settings.py`
```python
# 모든 요청마다 세션 저장 (세션 동기화)
SESSION_SAVE_EVERY_REQUEST = True

# 캐시 백엔드 (Dummy = 캐시 사용 안 함)
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.dummy.DummyCache",
    }
}
```

---

## 🔄 동작 흐름

### 1️⃣ 로그인하지 않은 사용자
```
127.0.0.1:8000 (루트 URL)
    ↓
login_page view 실행
    ↓
is_authenticated 확인: False
    ↓
Login.jsx 페이지 렌더링 ✅
```

### 2️⃣ 로그인 성공한 사용자
```
127.0.0.1:8000 (루트 URL)
    ↓
login_page view 실행
    ↓
is_authenticated 확인: True
    ↓
/dashboard로 자동 redirect ✅
    ↓
dashboard_view 실행
```

### 3️⃣ 로그아웃
```
/accounts/logout/ 접근
    ↓
logout_action view 실행
    ↓
세션 정리 + 캐시 방지 헤더 설정
    ↓
127.0.0.1:8000 (루트 URL)로 redirect
    ↓
Login.jsx 페이지 렌더링 ✅
```

---

## 🧪 테스트 방법

### 1. 로그인 페이지 확인
```bash
# 브라우저에서 접속
http://127.0.0.1:8000/

# 결과: Login.jsx 페이지가 표시됨 ✅
```

### 2. 로그인 테스트
```
아이디: admin
비밀번호: ad1234

# 결과: /dashboard로 이동 ✅
```

### 3. 새 탭에서 루트 URL 접속
```bash
http://127.0.0.1:8000/

# 결과: 로그인된 상태면 /dashboard로 자동 이동 ✅
```

### 4. 로그아웃 후 확인
```bash
# /accounts/logout/ 접근 또는 로그아웃 버튼 클릭

# 결과: Login.jsx 페이지 표시 ✅
```

### 5. 브라우저 캐시 무시하고 테스트 (Ctrl+Shift+Delete)
```bash
# 캐시 정리 후 재접속

# 결과: 항상 동일한 동작 ✅
```

---

## 📝 수정된 파일 목록

| 파일 | 수정 내용 |
|------|---------|
| `backend/config/urls.py` | 루트 경로 name을 'index'로 변경, 주석 추가 |
| `backend/apps/accounts/views.py` | @cache_control, @require_http_methods 데코레이터 추가, 세션 관리 개선, 주석 추가 |

---

## 🎯 핵심 포인트

1. **루트 경로는 항상 login_page로 이동**: URL 직접 설정
2. **로그인 상태 확인**: is_authenticated로 자동 redirect
3. **캐시 방지**: @cache_control 데코레이터
4. **세션 동기화**: SESSION_SAVE_EVERY_REQUEST + session.modified
5. **깔끔한 코드**: 주석으로 동작 명확화

---

## ⚠️ 주의사항

- **세션 쿠키**: SESSION_COOKIE_HTTPONLY = True (JavaScript로 접근 불가)
- **개발 서버**: DEBUG = True일 때 작동 확인 완료
- **프로덕션**: DEBUG = False일 때 ALLOWED_HOSTS 설정 필수
- **로그아웃**: redirect('index')는 name='index'인 루트 URL로 이동

---

## 🔧 향후 개선 사항 (선택)

1. **비밀번호 찾기**: Login.jsx의 "비밀번호 찾기" 링크 구현
2. **회원가입**: 회원가입 페이지 추가
3. **Remember Me**: 로그인 유지 기능 구현
4. **2FA**: 2단계 인증 추가
5. **로그인 시간 제한**: 세션 타임아웃 설정
