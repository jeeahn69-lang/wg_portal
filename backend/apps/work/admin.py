from django.contrib import admin
from .models import VillageWork

@admin.register(VillageWork)
class VillageWorkAdmin(admin.ModelAdmin):
    list_display = ('village', 'title', 'work_date', 'manager')