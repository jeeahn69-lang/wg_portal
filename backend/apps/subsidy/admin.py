from django.contrib import admin
from .models import Subsidy

@admin.register(Subsidy)
class SubsidyAdmin(admin.ModelAdmin):
    list_display = ('title', 'amount', 'target_village', 'is_approved')
    list_filter = ('is_approved', 'target_village')