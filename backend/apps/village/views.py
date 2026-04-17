from django.shortcuts import render
from inertia import render as inertia_render
from .models import Village
from django.db import models

def village_list(request):
    villages = list(Village.objects.values())

    return inertia_render(request, 'village/List', {
        'villages': villages
    })

def village_card(request):
    # 'VillageCardDetail'은 앞서 코딩한 .jsx 파일의 이름과 일치해야 합니다.
    return inertia_render(request, 'village/VillageDetail')

def dashboard(request):
    # 'village/Dashboard'는 Pages/village/Dashboard.jsx 파일을 의미합니다.
    return inertia_render(request, 'village/Dashboard')

def subsidy_list(request):
    # 'village/SubsidyList'는 프론트엔드 Pages 폴더 내 해당 컴포넌트 경로입니다.
    return inertia_render(request, 'village/SubsidyList')

def board_list(request): #BoardList_list(request):
    # 'village/SubsidyList'는 프론트엔드 Pages 폴더 내 해당 컴포넌트 경로입니다.
    return inertia_render(request, 'village/BoardList')

def village_sales(request):
    return inertia_render(request, 'village/VillageSales')