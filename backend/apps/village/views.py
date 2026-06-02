import traceback  # 👈 에러 추적용 패키지 상단 임포트
from django.shortcuts import render
from inertia import render as inertia_render
from .models import Village
from django.db import models
from django.db import connection
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

def village_list(request):
    villages = list(Village.objects.values())

    return inertia_render(request, 'village/List', {
        'villages': villages
    })

def village_card(request):
    # 'village/VillageInfoCreate'는 Pages/village/VillageCard.jsx 파일을 의미합니다.
    return inertia_render(request, 'village/VillageInfoCreate')

def village_info_list(request):
    # 'village/VillageInfoCreate'는 Pages/village/VillageInfoCreate.jsx 파일을 의미합니다.
    # return inertia_render(request, 'village/VillageInfoCreate')
    """마을 공동체 현황 목록 화면 렌더링 (검색용 콤보박스 데이터 포함)"""
    
    # 만들어둔 (_fetch_comcode_by_master) 함수를 사용하여 읍면(BC0001)과 설립유형(BC0003) 코드를 가져옵니다.
    regions = _fetch_comcode_by_master('SC0001')
    comptypes = _fetch_comcode_by_master('BC0003')

    return inertia_render(request, 'village/VillageInfoList', {
        'regions': regions,
        'comptypes': comptypes,
    })

    
def village_sales(request):
    return inertia_render(request, 'village/VillageSalesList')

def dashboard(request):
    # 'village/Dashboard'는 Pages/village/Dashboard.jsx 파일을 의미합니다.
    return inertia_render(request, 'village/Dashboard')

def subsidy_list(request):
    # 'village/SubsidyList'는 프론트엔드 Pages 폴더 내 해당 컴포넌트 경로입니다.
    return inertia_render(request, 'village/SubsidyList')

def board_list(request): #BoardList_list(request):
    # 'village/SubsidyList'는 프론트엔드 Pages 폴더 내 해당 컴포넌트 경로입니다.
    return inertia_render(request, 'village/BoardList')

def _fetch_comcode_by_master(master_cd):
    """공통코드 소분류 목록 조회"""
    query = """
        SELECT dtl_cd, dtl_nm
        FROM sys_comcode_dtl
        WHERE master_cd = %s AND use_yn = 'Y'
        ORDER BY dtl_nm ASC
    """
    with connection.cursor() as cursor:
        cursor.execute(query, [master_cd])
        rows = cursor.fetchall()
    
        return [{'code': row[0], 'name': row[1]} for row in rows]



@require_http_methods(["GET"])
def establishment_purposes(request):
    """설립목적(BC0001) 콤보박스용 JSON API"""
    return JsonResponse(_fetch_comcode_by_master('BC0001'), safe=False)

@require_http_methods(["GET"])
def establishment_types(request):
    """설립유형(BC0002) 콤보박스용 JSON API"""
    return JsonResponse(_fetch_comcode_by_master('BC0002'), safe=False)

@require_http_methods(["GET"])
def corporation_types(request):
    """법인유형(BC0003) 콤보박스용 JSON API"""
    return JsonResponse(_fetch_comcode_by_master('BC0003'), safe=False)

@require_http_methods(["GET"])
def repactivity_types(request):
    """대표자 활동유형(BC0004) 콤보박스용 JSON API"""
    return JsonResponse(_fetch_comcode_by_master('BC0004'), safe=False)

@require_http_methods(["GET"])
def workactivity_types(request):
    """실무자 활동유형(BC0004) 콤보박스용 JSON API"""
    return JsonResponse(_fetch_comcode_by_master('BC0004'), safe=False)

def village_info_create(request):
    """마을 정보 등록 화면 렌더링 (공통코드 초기값 포함)"""
    return inertia_render(request, 'village/VillageInfoCreate', {
        'purposes': _fetch_comcode_by_master('BC0001'),
        'establishmentTypes': _fetch_comcode_by_master('BC0002'),
        'corporationTypes': _fetch_comcode_by_master('BC0003'),
        'repactivityTypes': _fetch_comcode_by_master('BC0004'),
        'workactivityTypes': _fetch_comcode_by_master('BC0004'),
    })

# =====================================================================
#  2026-05-26 신규 추가: 프론트엔드 [조회하기] 연동용 실시간 DB 데이터 조인 API
# =====================================================================
@require_http_methods(["GET"])
def village_info_search_api(request):
    """마을 공동체 현황 데이터 검색 API (에러 디버깅용 예외처리 추가)"""
    try:
        region = request.GET.get('region', '전체')
        village = request.GET.get('village', '')
        council = request.GET.get('council', '전체')
        
        # SQL 쿼리 본문
        query = """
            SELECT 
                vmb.vil_idx             AS vil_idx,
                vmb.vil_mng_no          AS vil_mng_no,
                sc.dtl_nm               AS eubmyeon,
                vmb.vil_nm              AS village,
                vcd.comp_corp_nm        AS corporation,
                public.fn_get_comcode_nm('BC0002', vcd.inst_type_cd) AS type,   
                public.fn_get_comcode_nm('BC0003', vcd.corp_type_cd) AS cotype, 
                vcd.council_mbr_yn      AS council_mbr_yn,
                vmb.head_nm             AS villhead,
                vcd.main_prod_cn        AS product,
                vcd.main_act_cn         AS activity,
                oi.owner_nm             AS ceo,         
                mi.mng_nm               AS worker       
            FROM public.vil_mng_bas vmb
            LEFT JOIN public.vil_comp_dtl vcd ON vcd.vil_mng_no = vmb.vil_mng_no
            LEFT JOIN public.sys_comcode_dtl sc ON vmb.master_cd = sc.master_cd AND vmb.dtl_cd = sc.dtl_cd
            LEFT JOIN public.owner_info_dtl oi ON vmb.vil_mng_no = oi.vil_mng_no AND oi.use_yn = 'Y'
            LEFT JOIN public.mng_info_dtl mi ON vmb.vil_mng_no = mi.vil_mng_no AND mi.use_yn = 'Y'
            WHERE sc.master_cd = 'SC0001'
        """
        
        params = []
        
        if region != '전체':
            query += " AND sc.dtl_nm = %s"
            params.append(region)
            
        if village:
            query += " AND vmb.vil_nm LIKE %s"
            params.append(f"%{village}%")
            
        if council != '전체':
            query += " AND vcd.council_mbr_yn = %s"
            params.append(council)
            
        query += " ORDER BY corporation ASC NULLS LAST"
        
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()
            
            result_list = []
            for row in rows:
                row_dict = dict(zip(columns, row))
                if not row_dict.get('ceo'): row_dict['ceo'] = '-'
                if not row_dict.get('worker'): row_dict['worker'] = '-'
                row_dict['revenue'] = '-' 
                result_list.append(row_dict)
                
        return JsonResponse(result_list, safe=False)

    except Exception as e:
        # 🔥 중요: DB 에러나 파이썬 구문 에러 발생 시, 상세 내용을 콘솔과 JSON에 바인딩하여 뿜어줍니다.
        print("====== [마을조회 API 에러 발생] ======")
        print(traceback.format_exc())
        print("====================================")
        return JsonResponse({
            "error_message": str(e),
            "detail": traceback.format_exc()
        }, status=500)
    
# ===========================================================================================================
#  2026-05-26 신규 추가: 마을공동체 현황에서 1개의 행을 선택, 마을정보 상세조회 연동용 실시간 DB 데이터 조인 API
# ===========================================================================================================
@require_http_methods(["GET"])
def village_info_detail_api(request, vil_mng_no):
    """마을 공동체 기본정보/대표자정보 상세 조회 API"""
    try:
        query = """
            SELECT 
                -- 1. 마을 기본정보
                vmb.vil_mng_no              AS vil_mng_no,                      -- 마을관리번호
                vmb.vil_nm                  AS vil_nm,                          -- 마을명
                vcd.comp_corp_nm            AS comp_corp_nm,                    -- 공동체 법인명
                vcd.biz_addr                AS biz_addr,                        -- 사업장 주소
                vmb.household_cnt           AS household_cnt,                   -- 세대수
                vmb.resident_cnt            AS resident_cnt,                    -- 주민수
                vmb.head_nm                 AS leader_nm,                       -- 이장명
                -- 2. 대표자 정보 (owner_info_dtl)
                oi.owner_nm                 AS owner_nm,                        -- 대표자 성명
                oi.owner_phone_no           AS owner_phone_no,                  -- 대표자 연락처
                TO_CHAR(oi.owner_birth_dt, 'YYYY-MM-DD') AS owner_birth_dt,     -- 대표자 생년월일
                oi.owner_age                AS owner_age,                       -- 대표자 연령
                CASE 
                    WHEN oi.owner_gender_cd = 'M' THEN '남성'
                    WHEN oi.owner_gender_cd = 'W' THEN '여성'
                    ELSE '기타'  									             -- 필요시 추가 구분 가능
                END                         AS owner_gender,           			-- 대표자 성별
                oi.rep_act_type_cd          AS rep_act_type_cd,                 -- 대표자 활동유형 코드
                oi.owner_email              AS owner_email,                     -- 대표자 이메일
                -- 3. 추가: 실무자 정보 (mng_info_dtl)
                mi.mng_nm                   AS worker_nm,                       -- 실무자 성명
                mi.mng_phone_no             AS worker_phone_no,                 -- 실무자 연락처
                TO_CHAR(mi.mng_birth_dt, 'YYYY-MM-DD') AS worker_birth_dt,      -- 실무자 생년월일
                mi.mng_age                  AS worker_age,                      -- 실무자 연령
                CASE 
                    WHEN mi.mng_gender_cd = 'M' THEN '남성'
                    WHEN mi.mng_gender_cd = 'W' THEN '여성'
                    ELSE 'nodata'                                               -- 필요시 추가 구분 가능
                END                         AS worker_gender, 					-- 실무자 성별
                mi.wrk_act_type_cd          AS wrk_act_type_cd,					-- 실무자 활동유형 코드
                mi.mng_email                AS worker_email,                    -- 실무자 이메일
                -- 4. 설립목적 및 유형 
        		vcd.inst_purp_cd		    AS inst_purp_cd,       				-- 설립목적구분
        		vcd.inst_type_cd   			AS inst_type_cd,       				-- 설립유형구분
        		vcd.corp_type_cd   			AS corp_type_cd,       				-- 법인유형구분
                vcd.inst_dt                 AS inst_dt,                         -- 설립일자 
                -- 5. 하단 협의회 및 SNS 정보
                vcd.homepage_yn             AS homepage_yn,                     -- 홈페이지(SNS) 유무 (Y/N)
                vcd.homepage_url            AS homepage_url,                    -- 홈페이지 URL
                vcd.main_prod_cn            AS main_prod_cn,					-- 주요제품내용
                vcd.main_act_cn             AS main_act_cn,					    -- 주요활동내용
                vcd.council_mbr_yn          AS council_mbr_yn,                  -- 공동체 협의회 회원 여부 (Y/N)
                TO_CHAR(vcd.whdw_dt, 'YYYY-MM-DD') AS whdw_dt                   -- 회원 탈퇴일자
            FROM public.vil_mng_bas vmb
            LEFT JOIN public.vil_comp_dtl vcd ON vmb.vil_mng_no = vcd.vil_mng_no
            LEFT JOIN public.owner_info_dtl oi ON vmb.vil_mng_no = oi.vil_mng_no AND oi.use_yn = 'Y'
            LEFT JOIN public.mng_info_dtl mi ON vmb.vil_mng_no = mi.vil_mng_no AND mi.use_yn = 'Y'
            WHERE vmb.vil_mng_no = %s;
        """
        
        with connection.cursor() as cursor:
            cursor.execute(query, [vil_mng_no])
            columns = [col[0] for col in cursor.description]
            row = cursor.fetchone()
            
            if not row:
                return JsonResponse({"error_message": "해당 마을 정보를 찾을 수 없습니다."}, status=404)
                
            data = dict(zip(columns, row))

            # [디버깅] 여기에 프린트문을 찍어서 터미널에 'comp_corp_nm'이 어떻게 찍히는지 보세요!
            print("====== 백엔드 최종 전송 데이터 ======")
            print(data) 
            print("==================================")

            
            # 클라이언트 단 포맷 안정성을 위한 Null 및 기본값 방어 코드
            data['household_cnt'] = data.get('household_cnt') or 0
            data['resident_cnt'] = data.get('resident_cnt') or 0
            data['homepage_yn'] = data.get('homepage_yn') or 'N'
            data['council_mbr_yn'] = data.get('council_mbr_yn') or 'N'

            # -------------------------------------------------------------------------
            # 2026.05.28 [신규 추가] 4. 설립목적 및 유형 방어 코드 바인딩
            # -------------------------------------------------------------------------
            # select box 나 라디오 버튼에서 기본 매핑을 위해 null 일 때 '선택' 또는 빈 문자열 처리
            data['inst_purp_cd'] = data.get('inst_purp_cd') or '선택'
            data['inst_type_cd'] = data.get('inst_type_cd') or '선택'
            data['corp_type_cd'] = data.get('corp_type_cd') or '선택'

            data['main_prod_cn'] = data.get('main_prod_cn') or ''
            data['main_act_cn'] = data.get('main_act_cn') or ''
            
            # 설립일자(inst_dt) JSON 변환 에러 방지 (날짜 객체일 경우 YYYY-MM-DD 문자열로 형변환)
            if data.get('inst_dt'):
                # SQL에서 TO_CHAR 처리를 안 했을 경우를 대비한 파이썬 단 안전 변환
                if hasattr(data['inst_dt'], 'strftime'):
                    data['inst_dt'] = data['inst_dt'].strftime('%Y-%m-%d')
                else:
                    data['inst_dt'] = str(data['inst_dt']).replace('-', '').replace(' ', '')
            else:
                data['inst_dt'] = '' # null 이면 빈 문자열로 클라이언트에 토스
            
        return JsonResponse(data, safe=False)

    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({"error_message": str(e), "detail": traceback.format_exc()}, status=500)