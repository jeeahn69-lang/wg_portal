# backend/apps/accounts/apps.py

from django.apps import AppConfig

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.accounts'  # ← 이 부분을 반드시 'apps.accounts'로 수정하세요.