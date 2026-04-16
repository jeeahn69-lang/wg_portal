# backend/apps/village/apps.py

from django.apps import AppConfig

class VillageConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    # 중요: 현재 구조가 backend/apps/village 이므로 경로를 맞춰줍니다.
    name = 'apps.village'