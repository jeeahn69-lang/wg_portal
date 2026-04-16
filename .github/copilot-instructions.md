# WG Portal - AI Coding Guidelines

## Architecture Overview
This is a Django 6.0.1 web portal for Wanju Village Marketing Group, managing 577 villages with hierarchical code systems. Core components:
- **Dashboard app**: Main functionality with models for CommonCode/SubCode (hierarchical codes) and Village (region, ri_name, village_name, etc.)
- **Jazzmin admin UI**: Customized admin interface with Korean branding
- **SQLite database**: Simple deployment, migrations in `dashboard/migrations/`
- **Korean localization**: All UI text in Korean, Seoul timezone

## Key Models & Relationships
- `CommonCode` (상위코드) → `SubCode` (하위코드) via `parent_code` FK
- `Village.region` FK to `SubCode` (읍/면 codes)
- Unique constraint: `(region, ri_name, village_name)` prevents duplicate villages per area

## Development Workflows
- **Run server**: `python manage.py runserver` (activate venv first)
- **Database**: `python manage.py makemigrations dashboard && python manage.py migrate`
- **Admin access**: `/admin/` with Jazzmin UI, login required for all views
- **Import/Export**: Uses `django-import-export` for Excel operations on codes/villages

## Coding Patterns
- **Views**: Function-based, use `select_related()` for FK joins (e.g., `Village.objects.select_related('region')`)
- **Search**: Q objects for multi-field search: `Q(village_name__icontains=kw) | Q(ri_name__icontains=kw)`
- **Pagination**: 10 items per page using `Paginator`
- **Templates**: Extend `base.html`, load static CSS/JS, use `{% url %}` for links
- **JavaScript**: DOM manipulation for dynamic forms (e.g., adding table rows in code_management.js)
- **Models**: Verbose names in Korean, `unique_together` for business constraints

## File Structure Conventions
- **Static files**: `static/dashboard/css/`, `static/dashboard/images/` for UI assets
- **Templates**: `dashboard/templates/dashboard/` with base.html extension
- **URLs**: App namespace 'dashboard', paths like `villages/<int:pk>/` for details
- **Settings**: Korean language code 'ko-kr', custom JAZZMIN_SETTINGS for branding

## Common Tasks
- Adding village fields: Update `Village` model, run migrations, update templates/forms
- Code management: CRUD views in `views.py`, dynamic JS for sub-code editing
- Filtering: Region dropdown from `SubCode.objects.filter(parent_code='A03')`

## Dependencies
- Core: Django 6.0.1, jazzmin, django-import-export
- No requirements.txt; install manually in venv</content>
<parameter name="filePath">c:\workspace\wg_portal\.github\copilot-instructions.md

# 언어 설정
- 모든 답변과 진행 과정 설명은 반드시 한국어로 작성할 것.
- 코드를 분석하거나 수정 계획을 세울 때도 사용자에게 한국어로 보고할 것.
- 전문적이고 친절한 어조를 유지할 것.