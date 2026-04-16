import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-^^nr%*%6lq+)pd)s_@1oy(^l@akc)ua(lxnu0h#f=**7il$zg$'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'jazzmin',  # 가장 위에 추가
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'import_export', # 엑셀 import, export.
    'inertia',       #이너지아 추가
    'django_vite',
    
    
    # 우리가 만든 앱들
    'apps.accounts',  # login , logout 
    # 'apps.village',
    'apps.subsidy',
    'apps.work',
    'apps.board',
    'apps.system',
    'apps.village.apps.VillageConfig',

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'inertia.middleware.InertiaMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.csrf',  
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'wg_portal',
        'USER': 'wg_user',
        'PASSWORD': 'wg1234',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}



# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = 'ko-kr'

TIME_ZONE = 'Asia/Seoul'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/



# settings.py 파일 맨 아래에 추가하세요.

JAZZMIN_SETTINGS = {
    # 1. 브라우저 탭 및 상단 타이틀
    "site_title": "완주군 마을 통합 마케팅 지원단",
    "site_header": "마을 통합 관리 시스템",
    "site_brand": "완주 마을 포털",
    "welcome_sign": "완주군 마을 관리 페이지에 오신 것을 환영합니다",
    "copyright": "Wanju Village Marketing Group",

    # 2. UI Builder 활성화 (이게 있어야 오른쪽 하단에 설정 아이콘이 뜹니다)
    "show_ui_builder": True,  # 스펠링(show_ui_builder)과 콤마(,) 확인!

    # 3. 메뉴 구성
    "show_sidebar": True,
    "navigation_expanded": True,
    
    # 4. 상단 메뉴에 바로가기 추가 (나중에 모델명을 여기에 넣으시면 됩니다)
    "topmenu_links": [
        {"name": "홈",  "url": "admin:index", "permissions": ["auth.view_user"]},
        {"model": "auth.User"},
    ],

    # 아이콘 설정 (Font Awesome 사용 가능)
    "icons": {
        "auth": "fas dreaming-user",
        "auth.user": "fas fa-user",
    },
}

# JAZZMIN_SETTINGS와 별도로 추가하세요!
JAZZMIN_UI_TWEAKS = {
    "navbar_variant": "navbar-info",           # 상단바를 완주 로고와 어울리는 파란색으로
    "sidebar": "sidebar-dark-info",            # 사이드바 강조색도 파란색으로
    "sidebar_nav_child_indent": True,
    "brand_small_text": False,
    "brand_colour": "navbar-info",             # 로고 영역 배경색
    "accent": "accent-info",
    "navbar": "navbar-info navbar-dark",       # 상단바 텍스트 하얗게
    "no_navbar_border": True,
    "navbar_fixed": True,                      # 상단바 고정 (편의성)
    "sidebar_fixed": True,                     # 사이드바 고정
    "button_classes": {
    "primary": "btn-outline-primary",
    "secondary": "btn-outline-secondary",
    "info": "btn-info",
    "warning": "btn-warning",
    "danger": "btn-danger",
    "success": "btn-success"
    }
}

X_FRAME_OPTIONS = 'SAMEORIGIN'

# Inertia 설정
INERTIA_LAYOUT = 'base_inertia.html'

INERTIA_SSR = False


# Vite 설정
DJANGO_VITE_DEV_MODE = DEBUG
DJANGO_VITE_DEV_SERVER_HOST = '127.0.0.1'
DJANGO_VITE_DEV_SERVER_PORT = 5173
DJANGO_VITE_STATIC_URL_PREFIX = ""

DJANGO_VITE = {
    "default": {
        "dev_mode": DEBUG,
        "dev_server_host": "127.0.0.1",
        "dev_server_port": 5173,
        "static_url_prefix": "",  # 개발 모드에서 static prefix 제거
    }
}

STATIC_URL = '/static/'

# 핵심: Vite가 빌드한 파일(dist)이 저장될 물리적 경로
# 이미지 구조상 backend/static/dist 이므로 아래와 같이 설정합니다.
DJANGO_VITE_ASSETS_PATH = BASE_DIR / 'static' / 'dist'

# Vite/Static 설정
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

# 프로젝트 루트 폴더에 'staticfiles'라는 이름으로 모으겠다는 설정입니다.
STATIC_ROOT = BASE_DIR / 'staticfiles'

# CSRF 설정 (Inertia 통신 필수)
CSRF_COOKIE_HTTPONLY = False
CSRF_HEADER_NAME = 'HTTP_X_XSRF_TOKEN'
CSRF_COOKIE_NAME = 'XSRF-TOKEN'

SESSION_SAVE_EVERY_REQUEST = True

# 1. CSRF 신뢰 도메인 추가 (포트 번호까지 정확히)
CSRF_TRUSTED_ORIGINS = [
    'http://127.0.0.1:8000',
    'http://localhost:8000',
]

# 2. 세션 쿠키 설정 (로컬 개발 시 보안 설정이 너무 높으면 쿠키가 차단될 수 있음)
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'  # None이 아니라 Lax로 설정

# 3. 만약 HTTPS가 아닌 일반 HTTP(127.0.0.1)에서 테스트 중이라면 아래 값들은 False여야 합니다.
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# 3. 도메인 설정 (비어있거나 127.0.0.1이어야 합니다)
SESSION_COOKIE_DOMAIN = None

