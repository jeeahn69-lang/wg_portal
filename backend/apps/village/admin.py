from django.contrib import admin
from .models import Village

@admin.register(Village)
class VillageAdmin(admin.ModelAdmin):
    list_display = ('name', 'leader_name', 'created_at')
    search_fields = ('name', 'leader_name')