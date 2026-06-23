import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from "../../layouts/MainLayout";
import { useTabs } from '../../context/TabContext';
import { usePage } from '@inertiajs/react';

export default function VillageInfoCreate({
    vilMngNo: propsVilMngNo = null, // 마을 리스트에서 행 클릭 시 전달받을 마을 관리 번호
     
}) {
    const { openTabs, activeTabId } = useTabs();
    const currentTab = openTabs.find(tab => tab.id === activeTabId);
    // 2026.05.27 Props로 직접 넘어왔거나, 탭 객체(currentTab) 내부에 숨어있는 번호를 하나로 완벽하게 병합합니다.
    const vilMngNo = propsVilMngNo || currentTab?.vilMngNo || null;

    //const isDetailMode = currentTab?.id !== 'vlinfo'; // 'vlinfo'는 신규 등록용 탭 ID로 가정합니다. 실제로는 탭 생성 시 이 ID를 명확히 지정해야 합니다.

    // 2026.06.23 수정: isDetailMode를 vilMngNo 존재 여부로 판단하도록 변경 (신규 등록 시 vilMngNo는 null)
    const isDetailMode = !!vilMngNo;

    // 2026.06.19 수정: 상태 제어를 위해 기존 고정값을 빈 문자열 상태로 전환
    const [jibeonAddress, setJibeonAddress] = useState(''); // 2026.06.04 지번주소 상태 추가
    const [eubmyeonName, setEubmyeonName] = useState(''); // 2026.06.04 읍면명 상태 추가
    const [villageName, setVillageName] = useState('');
    const [corpName, setCorpName] = useState(''); // 공동체 법인명
    const [leaderName, setLeaderName] = useState(''); // 이장명

    const [activeTab, setActiveTab] = useState('기본정보');
    const tabs = ['기본정보', '지원사업', '매출/일자리', '시설/장비', '사업장 전경', '현장점검'];

    // 설립목적(BC0001) 콤보박스 상태
    const [selectedPurpose, setSelectedPurpose] = useState('');
    const [purposeOptions, setPurposeOptions] = useState([]);
    
    // 설립유형(BC0002) 콤보박스 상태
    const [selectedEstablishmentType, setSelectedEstablishmentType] = useState('');
    const [establishmentTypeOptions, setEstablishmentTypeOptions] = useState([]);
    
    // 법인유형(BC0003) 콤보박스 상태
    const [selectedCorporationType, setSelectedCorporationType] = useState('');
    const [corporationTypeOptions, setCorporationTypeOptions] = useState([]);
    
    // 대표자 활동유형(BC0004) 콤보박스 상태
    const [selectedRepactivityType, setSelectedRepactivityType] = useState('');
    const [repactivityTypeOptions, setRepactivityTypeOptions] = useState([]);
    
    // 실무자 활동유형(BC0005) 콤보박스 상태
    const [selectedWorkactivityType, setSelectedWorkactivityType] = useState('');
    const [workactivityTypeOptions, setWorkactivityTypeOptions] = useState([]);

    // 대표자 정보 세부 상태 관리
    const [ownerName, setOwnerName] = useState(''); // 대표자 성명
    const [phoneRep, setPhoneRep] = useState('');  // 대표자 연락처
    const [birthDateRep, setBirthDateRep] = useState(''); // 대표자 생년월일
    const [birthDateErrorRep, setBirthDateErrorRep] = useState(""); // 대표자 생년월일 에러
    const [ownerGender, setOwnerGender] = useState('남성'); // 대표자 성별
    const [emailRep, setEmailRep] = useState(''); // 대표자 이메일 상태 추가

    // 실무자 정보 세부 상태 관리
    const [workerName, setWorkerName] = useState(''); // 실무자 성명
    const [phoneWorker, setPhoneWorker] = useState('');  // 실무자 연락처
    const [birthDateWorker, setBirthDateWorker] = useState(''); // 실무자 생년월일
    const [birthDateErrorWorker, setBirthDateErrorWorker] = useState(""); // 실무자 생년월일 에러
    const [workerGender, setWorkerGender] = useState('여성'); // 실무자 성별
    const [emailWorker, setEmailWorker] = useState(''); // 실무자 이메일 상태 추가

    // 설립 및 기타 운영 상태 관리
    const [establishmentDate, setEstablishmentDate] = useState(''); // 설립시기
    const [establishmentDateError, setEstablishmentDateError] = useState(""); // 설립시기 에러
    const [mainProducts, setMainProducts] = useState(''); // 주요 제품
    const [mainActivities, setMainActivities] = useState(''); // 주요 활동
    
    // 하단 협의회 및 SNS 상태 관리
    const [homepageYn, setHomepageYn] = useState('없음'); // 홈페이지 유무
    const [homepageUrl, setHomepageUrl] = useState(''); // 홈페이지 URL
    const [isYn, setIsYn] = useState('아니오'); // 협의회 회원여부 (라디오)
    const [memberOutDate, setMemberOutDate] = useState(''); // 탈퇴일자
    const [memberOutDateError, setMemberOutDateError] = useState(""); // 탈퇴일자 에러

    const [households, setHouseholds] = useState(''); // 세대수
    const [population, setPopulation] = useState(''); // 주민수
    const [businessAddress, setBusinessAddress] = useState(''); // 사업장 주소
    const [isScriptLoaded, setIsScriptLoaded] = useState(false); // Daum 스크립트 상태
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false); // 주소 팝업 상태
    const [isLoadingDetail, setIsLoadingDetail] = useState(false); // 상세조회 로딩 상태

    // 2026.06.19 수정: resetForm 함수를 모든 상태 선언 뒤로 이동 (React Hook 에러 해결)
    const resetForm = () => {
        setVillageName('');
        setJibeonAddress('');
        setEubmyeonName('');
        setCorpName('');
        setBusinessAddress('');
        setHouseholds('0');
        setPopulation('0');
        setLeaderName('');
        setOwnerName('');
        setPhoneRep('');
        setBirthDateRep('');
        setOwnerGender('남성');
        setEmailRep('');
        setWorkerName('');
        setPhoneWorker('');
        setBirthDateWorker('');
        setWorkerGender('여성');
        setEmailWorker('');
        setEstablishmentDate('');
        setMainProducts('');
        setMainActivities('');
        setHomepageYn('없음');
        setHomepageUrl('');
        setIsYn('아니오');
        setMemberOutDate('');
        setSelectedPurpose('');
        setSelectedEstablishmentType('');
        setSelectedCorporationType('');
        setSelectedRepactivityType('');
        setSelectedWorkactivityType('');
    };


   

    // 🔥 [추가] 목록에서 행 클릭 시 (%s 파라미터 쿼리 결과) 데이터를 받아와 화면 상태에 채워주는 훅
    useEffect(() => {

        if (!isDetailMode) {
            return; // 신규 등록 모드인 경우 상세조회 로직을 건너뜁니다.
        }

        const fetchVillageDetail = async () => {
            
            setIsLoadingDetail(true);

            // [2026.06.05] 상세조회 시작 시점에 모든 상태를 초기화하여, 이전 데이터가 잠깐이라도 보이는 것을 방지합니다.
            resetForm(); 
            
            try {
                // 2026.05.28 1. 5개의 공통 코드 데이터를 병렬로 동시에 가져옵니다. (속도 최적화)
                const [purpRes, estRes, corpRes, repRes, workRes] = await Promise.all([
                    fetch('/village/purposes/'),
                    fetch('/village/establishment-types/'),
                    fetch('/village/corporation-types/'),
                    fetch('/village/repactivity-types/'),
                    fetch('/village/workactivity-types/')
                ]);

                // 공통 코드 데이터 파싱 및 매핑 헬퍼 함수
                const parseOptions = async (res) => {
                    if (!res.ok) return [];
                    const data = await res.json();
                    return (Array.isArray(data) ? data : []).map(item => ({
                        code: item.code ?? item.dtl_cd,
                        name: item.name ?? item.dtl_nm,
                    }));
                };

                // 2026.05.28 공통 코드 파싱한 데이터를 옵션 상태에 저장합니다.
                setPurposeOptions(await parseOptions(purpRes));
                setEstablishmentTypeOptions(await parseOptions(estRes));
                setCorporationTypeOptions(await parseOptions(corpRes));
                setRepactivityTypeOptions(await parseOptions(repRes));
                setWorkactivityTypeOptions(await parseOptions(workRes));
                
                // 2026.05.28 2. 기존 마을 데이터 상세조회 및 바인딩
                if (vilMngNo) {
                    const response = await fetch(`/village/info-detail-api/${vilMngNo}/`);
                    if (!response.ok) throw new Error("상세조회 실패");
                    const data = await response.json();

                    // 1. 마을 기본정보 바인딩
                    setVillageName(data.vil_nm || '');
                    setJibeonAddress(data.vil_jibun_addr || ''); // 2026.06.04 지번주소 추가
                    setEubmyeonName(data.eubmyeon_nm || ''); // 2026.06.04 읍면명 추가
                    setCorpName(data.comp_corp_nm || '');
                    setBusinessAddress(data.biz_addr || '');
                    setHouseholds(data.household_cnt ? String(data.household_cnt) : '0');
                    setPopulation(data.resident_cnt ? String(data.resident_cnt) : '0');
                    setLeaderName(data.leader_nm || '');
                    
                    // 2. 대표자 정보 바인딩
                    setOwnerName(data.owner_nm || '');
                    setPhoneRep(data.owner_phone_no ? data.owner_phone_no.replace(/\D/g, '') : '');
                    setBirthDateRep(data.owner_birth_dt ? data.owner_birth_dt.replace(/\D/g, '') : '');
                    setOwnerGender(data.owner_gender || '남성');
                    setEmailRep(data.owner_email || '');
                    
                    // 3. 실무자 정보 바인딩 (새 확장 쿼리 데이터 매핑)
                    setWorkerName(data.worker_nm || '');
                    setPhoneWorker(data.worker_phone_no ? data.worker_phone_no.replace(/\D/g, '') : '');
                    setBirthDateWorker(data.worker_birth_dt ? data.worker_birth_dt.replace(/\D/g, '') : '');
                    setWorkerGender(data.worker_gender || '여성');
                    setEmailWorker(data.worker_email || '');

                    // 4. 설립 및 기타 운영 상태 바인딩 2026.05.28 [신규 추가]
                    setEstablishmentDate(data.inst_dt ? data.inst_dt.replace(/\D/g, '') : ''); // 설립일자('-' 제거 후 세팅)
                    setMainProducts(data.main_prod_cn || ''); // 주요제품내용 상태 세팅
                    setMainActivities(data.main_act_cn || ''); // 주요활동내용 상태 세팅

                    // 5. 하단 협의회 및 홈페이지 정보 바인딩
                    setHomepageYn(data.homepage_yn === 'Y' ? '있음' : '없음');
                    setHomepageUrl(data.homepage_url || '');
                    setIsYn(data.council_mbr_yn === 'Y' ? '예' : '아니오');
                    setMemberOutDate(data.whdw_dt ? data.whdw_dt.replace(/\D/g, '') : '');

                    // [핵심] 위에서 공통코드를 셋팅했으므로, DB값이 들어가는 순간 콤보박스에 자동 매핑됩니다.
                    setSelectedPurpose(data.inst_purp_cd || ''); 
                    setSelectedEstablishmentType(data.inst_type_cd || '');    
                    setSelectedCorporationType(data.corp_type_cd || '');      
                    setSelectedRepactivityType(data.rep_act_type_cd || '');
                    setSelectedWorkactivityType(data.wrk_act_type_cd || '');
                } else {
                setVillageName(currentTab?.villageName || '신규 마을');
                // setHouseholds('45');
                // setPopulation('112');
                }

            } catch (error) {
                console.error("마을 데이터 상세 바인딩 실패:", error);
            } finally {
                setIsLoadingDetail(false);
            }
        };

        fetchVillageDetail();
    }, [vilMngNo]);
    //}, [vilMngNo, currentTab]);


    
       
    // Daum Postcode API 스크립트 동적 로드
    useEffect(() => {
        if (window.daum && window.daum.Postcode) {
            setIsScriptLoaded(true);
            return;
        }
        const existingScript = document.querySelector('script[src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"]');
        if (existingScript) {
            setIsScriptLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        script.onload = () => {
            setIsScriptLoaded(true);
        };
        script.onerror = () => {
            setIsScriptLoaded(false);
        };
        document.head.appendChild(script);
    }, []);

    const handleNumberInput = (e, setter) => {
        const value = e.target.value.replace(/\D/g, '');
        setter(value);
    };

    const formatPhoneNumber = (value) => {
        if (!value) return '';
        const clean = value.replace(/\D/g, '');
        if (clean.length <= 3) return clean;
        if (clean.length <= 7) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
        return `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7, 11)}`;
    };

    const calculateAge = (birthDate) => {
        if (!birthDate || birthDate.length !== 8) return '';
        const year = parseInt(birthDate.slice(0, 4));
        const month = parseInt(birthDate.slice(4, 6)) - 1;
        const day = parseInt(birthDate.slice(6, 8));
        const birth = new Date(year, month, day);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age > 0 ? `${age}세` : '';
    };

    const ageRep = birthDateErrorRep ? '' : calculateAge(birthDateRep);
    const ageWorker = birthDateErrorWorker ? '' : calculateAge(birthDateWorker);

    const formatBirthDate = (value) => {
        const clean = value.replace(/\D/g, '');
        if (clean.length === 8) {
            return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`;
        }
        return value;
    };

    const handleBirthDateChange = (e, setter, errorSetter) => {
        const value = e.target.value.replace(/\D/g, '');
        setter(value);

        if (value.length === 8) {
            const year = parseInt(value.substring(0, 4));
            const month = parseInt(value.substring(4, 6));
            const day = parseInt(value.substring(6, 8));
            const date = new Date(year, month - 1, day);
            const today = new Date();

            if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day || year < 1800) {
                errorSetter("날짜 형식이 다릅니다.");
                setter("");
            } else if (date > today) {
                errorSetter("미래 날짜는 입력할 수 없습니다.");
                setter("");
            } else {
                errorSetter("");
            }
        } else if (value.length > 8) {
            errorSetter("8자리 숫자로 입력해주세요.");
        } else {
            errorSetter("");
        }
    };

    const handleAddressSelect = () => {
        if (isPostcodeOpen) return;
        if (!isScriptLoaded || typeof window.daum === 'undefined') {
            alert('주소 검색 서비스를 초기화 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }
        try {
            setIsPostcodeOpen(true);
            new window.daum.Postcode({
                oncomplete: (data) => {
                    let fullAddress = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
                    setBusinessAddress(fullAddress);
                    setIsPostcodeOpen(false);
                },
                onclose: () => {
                    setIsPostcodeOpen(false);
                }
            }).open();
        } catch (error) {
            console.error('[주소검색] 팝업 열기 실패:', error);
            setIsPostcodeOpen(false);
        }
    };


    return (
        <MainLayout>
            {/* 상단 헤더 섹션 */}
            <div className="flex items-center justify-between mb-8 p-8 bg-gray-200/20 rounded-lg border border-blue-100 shadow-xl transition-all">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-lg">{eubmyeonName}</span>
                        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tighter">{villageName}</h1>
                    </div>
                    {/* <p className="text-gray-500 font-medium">{businessAddress || '완주군 동상면 사봉리 123-12'}</p> */}
                    <p className="text-gray-500 font-medium">{jibeonAddress || '마을 주소를 별도로 등록해 주세요.'}</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-all">임시저장</button>
                    <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">정보수정</button>
                </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex gap-2 mb-6 p-1.5 bg-gray-100/50 rounded-lg w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 rounded-xl text-lg font-bold transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-600'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 탭 콘텐츠 영역 */}
            <div className="bg-gray-500/50 rounded-lg border border-blue-100 shadow-[0_10px_40px_rgba(37,99,235,0.15)] p-10 transition-all">
                {activeTab === '기본정보' && (
                    <div className="space-y-10">
                        {/* 섹션 1: 마을기본정보 */}
                        <section className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-lg"></div>
                                <h3 className="text-xl font-bold text-gray-950">마을기본정보</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">마을명</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md"
                                        value={villageName}
                                        onChange={(e) => setVillageName(e.target.value)}
                                        readOnly={!!vilMngNo}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">공동체 법인명</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md"
                                        placeholder="공동체 법인 (마을회사)명을 입력하세요"
                                        value={corpName}
                                        onChange={(e) => setCorpName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">사업장 주소</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-semibold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md cursor-pointer hover:bg-gray-300/30 transition-all"
                                            // 1. 초기 렌더링 시 DB에서 불러온 주소(businessAddress 상태값)를 먼저 보여줌
                                            value={businessAddress || ''}
                                            onChange={(e) => setBusinessAddress(e.target.value)}
                                            readOnly
                                            // 3. 사용자가 더블 클릭했을 때만 Daum 우편번호 검색 팝업 실행
                                            onDoubleClick={handleAddressSelect}
                                            placeholder="등록된 주소가 없습니다. 더블 클릭하여 주소를 검색하세요."
                                            // 4. 무조건 입력을 막는 readOnly 대신, 더블클릭 팝업과 키보드 입력을 모두 허용하기 위해 readOnly는 제거합니다.
                                            // (대신 사용자가 팝업을 쓰도록 안내 텍스트나 커서 포인터 스타일을 제공합니다)
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">세대수</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-blue-100/50 border border-blue-100 rounded-lg font-bold text-blue-600 focus:ring-2 focus:ring-blue-100 text-md"
                                        value={households}
                                        onChange={(e) => handleNumberInput(e, setHouseholds)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">주민수</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-blue-100/50 border border-blue-100 rounded-lg font-bold text-blue-600 focus:ring-2 focus:ring-blue-100 text-md"
                                        value={population}
                                        onChange={(e) => handleNumberInput(e, setPopulation)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">이장명</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md" 
                                        value={leaderName} 
                                        onChange={(e) => setLeaderName(e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 섹션 2: 대표자 정보 */}
                        <section className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-lg"></div>
                                <h3 className="text-xl font-bold text-gray-950">대표자 정보</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">성명</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md" 
                                        value={ownerName}
                                        onChange={(e) => setOwnerName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">연락처</label>
                                    <input type="text" className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md"
                                        value={formatPhoneNumber(phoneRep)}
                                        onChange={(e) => handleNumberInput(e, setPhoneRep)}
                                        placeholder="000-0000-0000"
                                        maxLength="13"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">생년월일</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className={`w-full p-4 bg-gray-300/40 rounded-lg font-bold text-gray-900 focus:ring-2 text-md ${birthDateErrorRep ? 'border-2 border-red-500 focus:ring-red-100' : 'border-none focus:ring-blue-100'}`}
                                            value={formatBirthDate(birthDateRep)}
                                            onChange={(e) => handleBirthDateChange(e, setBirthDateRep, setBirthDateErrorRep)}
                                            onBlur={() => setBirthDateErrorRep("")}
                                            placeholder="yyyy-mm-dd"
                                            maxLength="10"
                                        />
                                        {birthDateErrorRep && <p className="mt-2 ml-2 text-red-500 text-sm font-semibold">{birthDateErrorRep}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">연령</label>
                                    <input type="text" 
                                           className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md"
                                           placeholder="자동 계산"
                                           readOnly
                                           value={ageRep}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">성별</label>
                                    <select 
                                        className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md appearance-none cursor-pointer" 
                                        value={ownerGender} 
                                        onChange={(e) => setOwnerGender(e.target.value)}
                                    >
                                        <option value="남성">남성</option>
                                        <option value="여성">여성</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">활동유형</label>
                                    <select 
                                        value={selectedRepactivityType}
                                        onChange={(e) => setSelectedRepactivityType(e.target.value)}
                                        className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md appearance-none cursor-pointer disabled:opacity-60"
                                    >
                                        <option value="선택"></option>
                                        {repactivityTypeOptions.map((item) => (
                                            <option key={item.code} value={item.code}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">E-메일</label>
                                    <input 
                                        type="email" 
                                        className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md" 
                                        value={emailRep} // 정의된 emailRep 매핑 완료
                                        onChange={(e) => setEmailRep(e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 섹션 2-2: 실무자 정보 */}
                        <section className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-green-600 rounded-lg"></div>
                                <h3 className="text-xl font-bold text-gray-950">실무자 정보</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">성명</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md" 
                                        value={workerName} 
                                        onChange={(e) => setWorkerName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">연락처</label>
                                    <input type="text" className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md"
                                        value={formatPhoneNumber(phoneWorker)}
                                        onChange={(e) => handleNumberInput(e, setPhoneWorker)}
                                        placeholder="000-0000-0000"
                                        maxLength="13"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">생년월일</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className={`w-full p-4 bg-gray-300/40 rounded-lg font-bold text-gray-900 focus:ring-2 text-md ${birthDateErrorWorker ? 'border-2 border-red-500 focus:ring-red-100' : 'border-none focus:ring-blue-100'}`}
                                            value={formatBirthDate(birthDateWorker)}
                                            onChange={(e) => handleBirthDateChange(e, setBirthDateWorker, setBirthDateErrorWorker)}
                                            onBlur={() => setBirthDateErrorWorker("")}
                                            placeholder="yyyy-mm-dd"
                                            maxLength="10"
                                        />
                                        {birthDateErrorWorker && <p className="mt-2 ml-2 text-red-500 text-sm font-semibold">{birthDateErrorWorker}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">연령</label>
                                    <input type="text" 
                                           className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md"
                                           placeholder="자동 계산"
                                           readOnly
                                           value={ageWorker}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">성별</label>
                                    <select 
                                        className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md appearance-none cursor-pointer" 
                                        value={workerGender} 
                                        onChange={(e) => setWorkerGender(e.target.value)}
                                    >
                                        <option value="남성">남성</option>
                                        <option value="여성">여성</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">활동유형</label>
                                    <select 
                                        value={selectedWorkactivityType}
                                        onChange={(e) => setSelectedWorkactivityType(e.target.value)}
                                        className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md appearance-none cursor-pointer disabled:opacity-60"
                                    >
                                        <option value="선택"></option>
                                        {workactivityTypeOptions.map((item) => (
                                            <option key={item.code} value={item.code}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">E-메일</label>
                                    <input 
                                        type="email" 
                                        className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md" 
                                        value={emailWorker} 
                                        onChange={(e) => setEmailWorker(e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 섹션 3: 운영 및 설립 정보 */}
                        <section className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-lg"></div>
                                <h3 className="text-xl font-bold text-gray-950">설립 및 목적</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">설립목적</label>
                                    <select 
                                        value={selectedPurpose}
                                        onChange={(e) => setSelectedPurpose(e.target.value)}
                                        className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md appearance-none cursor-pointer disabled:opacity-60"
                                    >
                                        <option value="선택"></option>
                                        {purposeOptions.map((item) => (
                                            <option key={item.code} value={item.code}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">설립유형</label>
                                    <select
                                        value={selectedEstablishmentType}
                                        onChange={(e) => setSelectedEstablishmentType(e.target.value)}
                                        className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md appearance-none cursor-pointer disabled:opacity-60"
                                    >
                                        <option value="선택"></option>
                                        {establishmentTypeOptions.map((item) => (
                                            <option key={item.code} value={item.code}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">법인유형</label>
                                    <select
                                        value={selectedCorporationType}
                                        onChange={(e) => setSelectedCorporationType(e.target.value)}
                                        className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md appearance-none cursor-pointer disabled:opacity-60"
                                    >
                                        <option value="선택"></option>
                                        {corporationTypeOptions.map((item) => (
                                            <option key={item.code} value={item.code}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">설립일자</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className={`w-full p-4 bg-gray-300/40 rounded-lg font-bold text-gray-900 focus:ring-2 text-md ${establishmentDateError ? 'border-2 border-red-500 focus:ring-red-100' : 'border-none focus:ring-blue-100'}`}
                                            value={formatBirthDate(establishmentDate)}
                                            onChange={(e) => handleBirthDateChange(e, setEstablishmentDate, setEstablishmentDateError)}
                                            onBlur={() => setEstablishmentDateError("")}
                                            placeholder="yyyy-mm-dd"
                                            maxLength="10"
                                        />
                                        {establishmentDateError && <p className="mt-2 ml-2 text-red-500 text-sm font-semibold">{establishmentDateError}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-100 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-70 ml-1">주요 제품</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-white/10 border border-white/20 rounded-lg font-bold text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30 text-md backdrop-blur-md"
                                            value={mainProducts}
                                            onChange={(e) => setMainProducts(e.target.value)}
                                            placeholder="제품명을 입력하세요"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-70 ml-1">주요 활동</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-white/10 border border-white/20 rounded-lg font-bold text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30 text-md backdrop-blur-md"
                                            value={mainActivities}
                                            onChange={(e) => setMainActivities(e.target.value)}
                                            placeholder="활동 내용을 입력하세요"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 섹션 4: 기타 정보 */}
                        <section className="p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-500 ml-1">홈페이지(SNS) 유무</label>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <select
                                            className="w-full sm:w-40 p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md appearance-none cursor-pointer"
                                            value={homepageYn}
                                            onChange={(e) => setHomepageYn(e.target.value)}
                                        >
                                            <option value="없음">없음</option>
                                            <option value="있음">있음</option>
                                        </select>

                                        {homepageYn === '있음' ? (
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="https://example.com"
                                                    className="w-full p-4 bg-blue-50/50 border border-blue-100 rounded-lg font-bold text-blue-600 focus:ring-2 focus:ring-blue-200 text-md"
                                                    value={homepageUrl}
                                                    onChange={(e) => setHomepageUrl(e.target.value)}
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <span className="text-gray-400 text-sm font-medium ml-1">등록된 웹 주소가 없습니다.</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">마을공동체 협의회 회원 여부</label>
                                    <div className="w-full p-4 bg-gray-300/40 border-none rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-md flex justify-center items-center gap-10">
                                        <label className="flex items-center gap-2 cursor-pointer text-md font-semibold text-gray-950">
                                            <input
                                                type="radio"
                                                name="statusYn"
                                                value="아니오"
                                                checked={isYn === '아니오'}
                                                onChange={(e) => setIsYn(e.target.value)}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                            />
                                            <span>아니오</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-md font-semibold text-gray-950">
                                            <input
                                                type="radio"
                                                name="statusYn"
                                                value="예"
                                                checked={isYn === '예'}
                                                onChange={(e) => setIsYn(e.target.value)}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                            />
                                            <span>예</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">회원 탈퇴일자</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className={`w-full p-4 bg-gray-300/40 rounded-lg font-bold text-gray-900 focus:ring-2 text-md ${memberOutDateError ? 'border-2 border-red-500 focus:ring-red-100' : 'border-none focus:ring-blue-100'}`}
                                            value={formatBirthDate(memberOutDate)}
                                            onChange={(e) => handleBirthDateChange(e, setMemberOutDate, setMemberOutDateError)}
                                            onBlur={() => setMemberOutDateError("")}
                                            placeholder="yyyy-mm-dd"
                                            maxLength="10"
                                        />
                                        {memberOutDateError && <p className="mt-2 ml-2 text-red-500 text-sm font-semibold">{memberOutDateError}</p>}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === '지원사업' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                                <p className="text-sm font-bold text-blue-400 mb-1">총 지원 건수</p>
                                <p className="text-2xl font-black text-blue-700 text-center">6건</p>
                            </div>
                            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                                <p className="text-sm font-bold text-indigo-400 mb-1">누적 지원 금액</p>
                                <p className="text-2xl font-black text-indigo-700 text-center">838,600 <span className="text-sm font-bold">천원</span></p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-gray-400">
                                <p className="text-sm font-bold mb-1">최근 지원일</p>
                                <p className="text-2xl font-black italic text-center">2019.06.12</p>
                            </div>
                        </div>

                        <section>
                            <div className="flex items-center justify-between mb-6 px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-blue-600 rounded-lg"></div>
                                    <h3 className="text-xl font-bold text-gray-950">연도별 세부 지원내역</h3>
                                </div>
                                <div className="text-xs font-bold text-gray-950 uppercase tracking-tighter">Unit: KRW (1,000)</div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
                                <table className="w-full text-center text-sm">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b border-gray-200">
                                            <th rowSpan={2} className="px-4 py-5 text-[14px] font-bold text-gray-700 whitespace-nowrap">지원연도</th>
                                            <th rowSpan={2} className="px-4 py-5 text-[14px] font-bold text-gray-700 whitespace-nowrap">주관</th>
                                            <th rowSpan={2} className="px-4 py-5 text-[14px] font-bold text-gray-700 whitespace-nowrap">사업명</th>
                                            <th rowSpan={2} className="px-4 py-5 text-[14px] font-bold text-gray-700">사업내용</th>
                                            <th colSpan={5} className="px-4 py-5 text-[14px] font-bold text-gray-700 border-b border-gray-200">지원액</th>
                                        </tr>
                                        <tr className="bg-gray-50/80 border-b border-gray-200">
                                            <th className="px-4 py-4 text-[14px] font-bold text-gray-700 whitespace-nowrap">소계</th>
                                            <th className="px-4 py-4 text-[14px] font-bold text-gray-700 whitespace-nowrap">국</th>
                                            <th className="px-4 py-4 text-[14px] font-bold text-gray-700 whitespace-nowrap">도</th>
                                            <th className="px-4 py-4 text-[14px] font-bold text-gray-700 whitespace-nowrap">군</th>
                                            <th className="px-4 py-4 text-[14px] font-bold text-gray-700 whitespace-nowrap">자부담</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {[
                                            { year: '2012-03', supervisor: '행안부', name: '마을기업', content: '마을기업 지정 1차년도 사업비', total: 55000, national: 25000, provincial: '', county: 25000, self: 5000 },
                                            { year: '2013-04', supervisor: '행안부', name: '마을기업', content: '마을기업 지정 2차년도 사업비', total: 33000, national: 15000, provincial: '', county: 15000, self: 3000 },
                                            { year: '2016-05', supervisor: '완주군', name: '공동문화형사업', content: '지게놀이, 마을공연단 육성', total: 5000, national: '', provincial: '', county: 5000, self: '' },
                                            { year: '2016-05', supervisor: '완주군', name: '소득및체험상품개발', content: '건나물 상품개발', total: 5000, national: '', provincial: '', county: 5000, self: '' },
                                            { year: '2017-04', supervisor: '완주군', name: '파워빌리지', content: '시래기 건조기', total: 12000, national: '', provincial: '', county: 10000, self: 2000 },
                                            { year: '2018-04', supervisor: '완주군', name: '파워빌리지', content: '시래기 가공시설, 체험장리모델링', total: 24000, national: '', provincial: '', county: 20000, self: 4000 },
                                        ].map((row, idx) => (
                                            <tr key={idx} className="hover:bg-blue-50/30 transition-all">
                                                <td className="px-4 py-5 font-bold text-gray-900 whitespace-nowrap font-mono">{row.year}</td>
                                                <td className="px-4 py-5 text-gray-500 font-medium whitespace-nowrap">{row.supervisor}</td>
                                                <td className="px-4 py-5 font-semibold text-gray-900 whitespace-nowrap">{row.name}</td>
                                                <td className="px-4 py-5 text-gray-500 font-medium text-left">{row.content}</td>
                                                <td className="px-4 py-5 font-bold text-gray-900">{row.total ? row.total.toLocaleString() : ''}</td>
                                                <td className="px-4 py-5 text-gray-500">{row.national ? row.national.toLocaleString() : ''}</td>
                                                <td className="px-4 py-5 text-gray-500">{row.provincial ? row.provincial.toLocaleString() : ''}</td>
                                                <td className="px-4 py-5 text-gray-500">{row.county ? row.county.toLocaleString() : ''}</td>
                                                <td className="px-4 py-5 text-gray-500">{row.self ? row.self.toLocaleString() : ''}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <div className="p-6 bg-orange-50 rounded-lg border border-orange-100 flex items-center gap-4">
                            <span className="text-2xl">💡</span>
                            <p className="text-sm text-orange-700 font-medium">
                                위 지원 내역은 시스템에 등록된 공식 자료를 바탕으로 하며, 상세 증빙 서류는 <strong>[시설/장비]</strong> 탭의 자산 목록과 대조하여 확인하시기 바랍니다.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === '매출/일자리' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-lg"></div>
                                <h3 className="text-xl font-bold text-gray-950">4. 매출액(만원) / 일자리 수(명)</h3>
                            </div>
                            <button className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
                                <span>➕</span> 매출등록
                            </button>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-center">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-200">
                                        <th className="px-6 py-5 text-[14px] font-bold text-gray-700">연도별</th>
                                        <th className="px-6 py-5 text-[14px] font-bold text-gray-700">1분기</th>
                                        <th className="px-6 py-5 text-[14px] font-bold text-gray-700">2분기</th>
                                        <th className="px-6 py-5 text-[14px] font-bold text-gray-700">3분기</th>
                                        <th className="px-6 py-5 text-[14px] font-bold text-gray-700">4분기</th>
                                        <th className="px-6 py-5 text-[14px] font-bold text-gray-700">년합계</th>
                                        <th className="px-6 py-5 text-[14px] font-black text-gray-800 bg-gray-100/50">일자리(명)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {[
                                        { year: '2014년', q1: '1,000', q2: '2,000', q3: '3,000', q4: '4,000', q5: '10,000', annual: '상근:1 / 비상근:5' },
                                        { year: '2015년', q1: '1,000', q2: '2,000', q3: '3,000', q4: '4,000', q5: '10,000', annual: '상근:1 / 비상근:5' },
                                        { year: '2016년', q1: '1,000', q2: '2,000', q3: '3,000', q4: '4,000', q5: '10,000', annual: '상근:1 / 비상근:5' },
                                        { year: '2021년', q1: '1,000', q2: '2,000', q3: '3,000', q4: '4,000', q5: '10,000', annual: '상근:1 / 비상근:5' },
                                        { year: '2025년', q1: '3,000', q2: '0', q3: '0', q4: '0', q5: '3,000', annual: '상근:1 / 비상근:5' },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50/30 transition-all">
                                            <td className="px-6 py-5 font-bold text-gray-900 border-r border-gray-200 bg-gray-50/30">{row.year}</td>
                                            <td className="px-6 py-5 text-gray-500 font-medium">{row.q1}</td>
                                            <td className="px-6 py-5 text-gray-500 font-medium">{row.q2}</td>
                                            <td className="px-6 py-5 text-gray-500 font-medium">{row.q3}</td>
                                            <td className="px-6 py-5 text-gray-500 font-medium">{row.q4}</td>
                                            <td className="px-6 py-5 text-gray-500 font-medium">{row.q5}</td>
                                            <td className="px-6 py-5 font-black text-blue-600 bg-blue-50/20 border-l border-gray-200">{row.annual}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === '시설/장비' && (
                    <div className="space-y-12">
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-blue-600 rounded-lg"></div>
                                    <h3 className="text-xl font-bold text-gray-950">장비(가공·집기) 지원현황</h3>
                                </div>
                                <span className="text-xs font-bold text-gray-950 uppercase tracking-tighter">Unit: KRW (1,000)</span>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <table className="w-full text-center">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-200">
                                            <th className="px-6 py-5 text-[14px] font-bold text-gray-700 uppercase tracking-widest text-center w-20">연번</th>
                                            <th className="px-6 py-5 text-[14px] font-bold text-gray-700 uppercase tracking-widest whitespace-nowrap">지원년월</th>
                                            <th className="px-6 py-5 text-[14px] font-bold text-gray-700 uppercase tracking-widest">지원사업명</th>
                                            <th className="px-6 py-5 text-[14px] font-bold text-gray-700 uppercase tracking-widest">품목</th>
                                            <th className="px-6 py-5 text-[14px] font-bold text-gray-700 uppercase tracking-widest text-right">보조금</th>
                                            <th className="px-6 py-5 text-[14px] font-bold text-gray-700 uppercase tracking-widest">비고</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {[
                                            { id: 1, date: '2010-05', project: '파워빌리지', item: '체험마을 지하수개발', price: '20,000', note: '-' },
                                            { id: 2, date: '2010-05', project: '파워빌리지', item: '몽골텐트', price: '3,600', note: '2동' },
                                            { id: 3, date: '2010-06', project: '파워빌리지', item: '썰매장 안내간판', price: '5,600', note: '7개' },
                                            { id: 4, date: '2010-08', project: '파워빌리지', item: '장류 포장재', price: '2,000', note: '포장지, 용기, 스티커' },
                                            { id: 5, date: '2010-10', project: '파워빌리지', item: '두부체험틀', price: '300', note: '20개' },
                                            { id: 6, date: '2011-03', project: '파워빌리지', item: '썰매장 시설보수', price: '5,000', note: '-' },
                                        ].map((row) => (
                                            <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="px-6 py-5 text-center font-mono text-gray-400 text-sm">{row.id}</td>
                                                <td className="px-6 py-5 text-sm text-gray-600 font-bold font-mono">{row.date}</td>
                                                <td className="px-6 py-5 text-sm text-blue-600 font-semibold">{row.project}</td>
                                                <td className="px-6 py-5 font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{row.item}</td>
                                                <td className="px-6 py-5 text-right font-black text-blue-600 font-mono text-lg">{row.price}</td>
                                                <td className="px-6 py-5 text-sm text-gray-500 font-medium">{row.note}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === '사업장 전경' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-lg"></div>
                                <h3 className="text-xl font-bold text-gray-950">사업장 전경 이미지</h3>
                            </div>
                            <button className="px-5 py-2.5 bg-gray-950 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                이미지 업로드
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { title: '외부 전경 (동상면 사봉리)', desc: '마을 공동체 및 썰매장 진입로' },
                                { title: '내부 시설 (다목적체험관)', desc: '곤충 체험 및 실내 활동 공간' },
                                { title: '만경강 발원샘', desc: '마을 스토리텔링 연계 자원' },
                            ].map((img, i) => (
                                <div key={i} className="group relative cursor-pointer">
                                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden border border-gray-200 flex items-center justify-center text-gray-300 font-bold text-lg group-hover:bg-gray-200 transition-all">
                                        PHOTO AREA
                                    </div>
                                    <button className="absolute top-4 right-4 p-2.5 bg-red-500/90 hover:bg-red-600 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm" title="삭제">
                                        <svg xmlns="http://www.w3.org/2000/xl" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <div className="px-1">
                                        <h4 className="text-sm font-bold text-gray-800">{img.title}</h4>
                                        <p className="text-xs text-gray-400 mt-1 font-medium">{img.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === '현장점검' && (
                    <div className="space-y-6">
                        {[
                            { date: '2026.04.08', visitor: '최현주 외 4명', content: '현실적으로 운영이 멈춘 상태로 보임. 마을이장 장종수님이 협의회 참석 예정' },
                            { date: '2021.03', visitor: '최은아 외 2명', content: '온난화로 인한 얼음 썰매장 개장 불가. 대체사업 발굴 및 컨설팅 추진 필요' },
                        ].map((log, i) => (
                            <div key={i} className="p-6 bg-gray-50 rounded-lg border border-gray-200 relative overflow-hidden group">
                                <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-blue-600 font-bold font-mono">{log.date}</span>
                                    <span className="text-xs font-bold text-gray-400 bg-white px-3 py-1 rounded-lg border border-gray-200">방문자: {log.visitor}</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed font-medium">{log.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}