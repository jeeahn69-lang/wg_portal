import React, { useState, useEffect } from 'react';
import MainLayout from "../../layouts/MainLayout";
import { useTabs } from '../../context/TabContext';

export default function VillageInfoCreate() {
    const { openTabs, activeTabId } = useTabs();
    const currentTab = openTabs.find(tab => tab.id === activeTabId);
    const villageName = currentTab?.villageName || '밤티마을';
    const [activeTab, setActiveTab] = useState('기본정보');
    const tabs = ['기본정보', '지원사업', '매출/일자리', '시설/장비', '사업장 전경', '현장점검'];

    // 생년월일 상태 관리
    const [birthDateRep, setBirthDateRep] = useState(''); // 대표자
    const [birthDateWorker, setBirthDateWorker] = useState(''); // 실무자
    const [birthDateErrorRep, setBirthDateErrorRep] = useState(""); // 대표자 생년월일 에러 메시지 상태
    const [birthDateErrorWorker, setBirthDateErrorWorker] = useState(""); // 실무자 생년월일 에러 메시지 상태
    const [phoneRep, setPhoneRep] = useState('');  // 대표자 연락처
    const [phoneWorker, setPhoneWorker] = useState('');  // 실무자 연락처
    const [establishmentDate, setEstablishmentDate] = useState(''); // 설립시기
    const [establishmentDateError, setEstablishmentDateError] = useState(""); // 설립시기 에러 메시지 상태
    const [households, setHouseholds] = useState('45'); // 세대수
    const [population, setPopulation] = useState('112'); // 주민수
    const [businessAddress, setBusinessAddress] = useState(''); // 사업장 주소
    const [isScriptLoaded, setIsScriptLoaded] = useState(false); // Daum 스크립트 로드 상태
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false); // 주소 검색 팝업 열림 상태

    // Daum Postcode API 스크립트 동적 로드
    useEffect(() => {
        // 이미 스크립트가 로드되었는지 확인
        if (window.daum && window.daum.Postcode) {
            console.log('[Daum API] 이미 로드됨');
            setIsScriptLoaded(true);
            return;
        }

        // 이미 스크립트가 DOM에 있는지 확인
        const existingScript = document.querySelector('script[src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"]');
        if (existingScript) {
            console.log('[Daum API] 스크립트가 이미 DOM에 있습니다.');
            setIsScriptLoaded(true);
            return;
        }

        // 새로운 스크립트 생성
        const script = document.createElement('script');
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        script.onload = () => {
            console.log('[Daum API] 스크립트 로드 완료!');
            setIsScriptLoaded(true);
        };
        script.onerror = () => {
            console.error('[Daum API] 스크립트 로드 실패');
            setIsScriptLoaded(false);
        };
        document.head.appendChild(script);

        // cleanup 함수는 필요 없음 (스크립트는 유지)
    }, []);


    // [핸들러] 입력 시 숫자만 추출하여 상태에 저장
    const handleNumberInput = (e, setter) => {
        const value = e.target.value.replace(/\D/g, ''); // 숫자만
        setter(value);
    };

    // [포맷팅] 숫자를 010-0000-0000 형식으로 변환하여 화면에 표시
    const formatPhoneNumber = (value) => {
        if (!value) return '';
        const clean = value.replace(/\D/g, ''); // 숫자 외 제거
        if (clean.length <= 3) return clean;
        if (clean.length <= 7) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
        return `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7, 11)}`;
    };

    // 연령 계산
    const calculateAge = (birthDate) => {
        if (!birthDate || birthDate.length !== 8) return '';
        const year = parseInt(birthDate.slice(0, 4));
        const month = parseInt(birthDate.slice(4, 6)) - 1; // 월은 0-based
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

    // 생년월일 포맷팅 함수
    const formatBirthDate = (value) => {
        const clean = value.replace(/\D/g, '');
        if (clean.length === 8) {
            return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`;
        }
        return value;
    };

    // 년도 입력 핸들러 (숫자만 입력, 8자리 완성 시 유효성 체크)
    const handleBirthDateChange = (e, setter, errorSetter) => {
        const value = e.target.value.replace(/\D/g, ''); // 숫자만 남김
        setter(value);

        if (value.length === 8) {
            const year = parseInt(value.substring(0, 4));
            const month = parseInt(value.substring(4, 6));
            const day = parseInt(value.substring(6, 8));
            const date = new Date(year, month - 1, day);
            const today = new Date();

            // 유효성 체크: 실제 존재하는 날짜인지 확인
            if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day || year < 1800) {
                errorSetter("날짜 형식이 다릅니다.");
                setter(""); // 입력 박스 클리어
            } else if (date > today) {
                errorSetter("미래 날짜는 입력할 수 없습니다.");
                setter(""); // 입력 박스 클리어
            } else {
                errorSetter(""); // 정상일 때 에러 삭제
            }
        } else if (value.length > 0) {
            errorSetter("8자리 숫자로 입력해주세요.");
        } else {
            errorSetter("");
        }
    };

    // 주소 검색 완료 핸들러
    const handleAddressSelect = () => {
        // [추가] 이미 팝업이 열려 있는 경우 함수 종료
        if (isPostcodeOpen) {
        console.log('[주소검색] 이미 팝업이 열려 있어 중복 실행을 방지합니다.');
        return;
        }

        if (!isScriptLoaded || typeof window.daum === 'undefined') {
            alert('주소 검색 서비스를 초기화 중입니다. 잠시 후 다시 시도해주세요.');
            console.warn('[주소검색] Daum API가 아직 준비되지 않았습니다. isScriptLoaded:', isScriptLoaded);
            return;
        }
        
        try {
            console.log('[주소검색] Postcode 팝업 열기 시도...');

            setIsPostcodeOpen(true); // 팝업 열림 상태 설정

            new window.daum.Postcode({
                oncomplete: (data) => {
                    let fullAddress = '';

                    if (data.userSelectedType === 'R') {
                        fullAddress = data.roadAddress; // 도로명 주소
                    } else { 
                        fullAddress = data.jibunAddress; // 지번 주소
                    }

                    // const fullAddress = `${data.zonecode} ${data.address}`; // 기존 주소 형식
                    // const fullAddress = `${data.address}`; // 우편번호 제거된 주소 형식
                    const finalAddress = `${fullAddress}`; // 우편번호 포함된 주소 형식

                    setBusinessAddress(finalAddress);
                    setIsPostcodeOpen(false); // [추가] 데이터 선택 완료 시 상태 변경
                },
                onclose: () => {
                    console.log('[주소검색] 팝업 닫힘');
                    setIsPostcodeOpen(false); // [추가] 팝업이 닫힐 때 상태 변경
                }
            }).open();
            // console.log('[주소검색] Postcode 팝업 열기 성공');
        } catch (error) {
            console.error('[주소검색] 팝업 열기 실패:', error);
            alert('주소 검색 팝업을 열 수 없습니다. 콘솔을 확인해주세요.');
            setIsPostcodeOpen(false); // [추가] 에러 발생 시 상태 변경
        }
    };

    return (
        <MainLayout>
            {/* 상단 헤더 섹션 (처음부터 블루 네온 적용된 버전) */}
            {/* <div className="flex items-center justify-between mb-8 p-8 bg-white rounded-3xl border border-blue-50/50 shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all hover:shadow-xl hover:border-blue-100"> */}
            <div className="flex items-center justify-between mb-8 p-8 bg-white rounded-3xl border border-blue-100 shadow-xl transition-all">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-lg">동상면</span>
                        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tighter">{villageName}</h1>
                    </div>
                    <p className="text-gray-500 font-medium">완주군 동상면 사봉리 123-12</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all">임시저장</button>
                    {/* 정보수정 버튼의 그림자도 shadow-lg로 강화하면 더 세련되어 보입니다 */}
                    <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">정보수정</button>
                </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex gap-2 mb-6 p-1.5 bg-gray-100/50 rounded-2xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 rounded-xl text-lg font-bold transition-all ${activeTab === tab
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 탭 콘텐츠 영역 */}
            {/* <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-10"> */}
            <div className="bg-white rounded-[32px] border border-blue-100 shadow-[0_10px_40px_rgba(37,99,235,0.15)] p-10 transition-all">
                {activeTab === '기본정보' && (
                    <div className="space-y-10">
                        {/* 섹션 1: 마을기본정보 */}
                        <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                <h3 className="text-xl font-bold text-gray-950">마을기본정보</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">마을명</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg"
                                        defaultValue="밤티 마을"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">사업장 주소</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-semibold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg"
                                            value={businessAddress}
                                            // readOnly
                                            onDoubleClick={() => {
                                                console.log('[주소검색] 입력창 클릭됨');
                                                handleAddressSelect();
                                            }}
                                            placeholder="더블 클릭 시 주소 검색창이 열립니다."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">공동체 법인명</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg"
                                        placeholder="공동체 법인 (마을회사)명을 입력하세요"
                                        // defaultValue="밤티 마을"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">세대수</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-blue-50/50 border border-blue-100 rounded-2xl font-bold text-blue-600 focus:ring-2 focus:ring-blue-100 text-lg"
                                        value={households}
                                        onChange={(e) => handleNumberInput(e, setHouseholds)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">주민수</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-blue-50/50 border border-blue-100 rounded-2xl font-bold text-blue-600 focus:ring-2 focus:ring-blue-100 text-lg"
                                        value={population}
                                        onChange={(e) => handleNumberInput(e, setPopulation)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">이장명</label>
                                    {/* <input type="text" className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 font-bold text-blue-600 text-lg" defaultValue="김철수" /> */}
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" defaultValue="김철수" />
                                </div>
                            </div>
                        </section>

                        {/* 섹션 2: 대표자 정보 */}
                        <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                <h3 className="text-xl font-bold text-gray-950">대표자 정보</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">성명</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">연락처</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg"
                                        // value에서 포맷팅 함수로 감싸주는 게 핵심입니다
                                        value={formatPhoneNumber(phoneRep)}
                                        onChange={(e) => handleNumberInput(e, setPhoneRep)}
                                        placeholder="000-0000-0000"
                                        maxLength="13"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">생년월일</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className={`w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-900 focus:ring-2 text-lg 
                                                      ${birthDateErrorRep ? 'border-2 border-red-500 focus:ring-red-100' : 'border-none focus:ring-blue-100'}`}
                                            value={formatBirthDate(birthDateRep)}
                                            onChange={(e) => handleBirthDateChange(e, setBirthDateRep, setBirthDateErrorRep)}
                                            onBlur={() => setBirthDateErrorRep("")}
                                            placeholder="yyyy-mm-dd"
                                            maxLength="10"
                                        />
                                        {/* 에러 메시지 표시 구문 추가 */}
                                        {birthDateErrorRep && (
                                            <p className="mt-2 ml-2 text-red-500 text-sm font-semibold">
                                                {birthDateErrorRep}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">연령</label>
                                    <input type="text" 
                                           className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" value={ageRep} readOnly
                                           placeholder="생년월일 입력 시 자동 적용 됩니다."
                                           readOnly
                                           value={ageRep}
                                    />
                                </div>
                                 {/* 성별 선택 박스 */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">성별</label>
                                    <select className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg appearance-none cursor-pointer" defaultValue="남성" >
                                        <option value="남성">남성</option>
                                        <option value="여성">여성</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">활동유형</label>
                                    <select className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg appearance-none cursor-pointer">
                                        <option value="선택">선택</option>
                                        <option value="마을공동체">무보수명예직</option>
                                        <option value="사회적협동조합">유보수직</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">E-메일</label>
                                    <input type="email" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" defaultValue="" />
                                </div>
                            </div>
                        </section>

                        {/* 섹션 2-2: 실무자 정보 */}
                        <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-green-600 rounded-full"></div>
                                <h3 className="text-xl font-bold text-gray-950">실무자 정보</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">성명</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" defaultValue="" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">연락처</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg"
                                        // value에서 포맷팅 함수로 감싸주는 게 핵심입니다
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
                                            className={`w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-900 focus:ring-2 text-lg 
                                                      ${birthDateErrorWorker ? 'border-2 border-red-500 focus:ring-red-100' : 'border-none focus:ring-blue-100'}`}
                                            value={formatBirthDate(birthDateWorker)}
                                            onChange={(e) => handleBirthDateChange(e, setBirthDateWorker, setBirthDateErrorWorker)}
                                            onBlur={() => setBirthDateErrorWorker("")}
                                            placeholder="yyyy-mm-dd"
                                            maxLength="10"
                                        />
                                        {/* 에러 메시지 표시 구문 추가 */}
                                        {birthDateErrorWorker && (
                                            <p className="mt-2 ml-2 text-red-500 text-sm font-semibold">
                                                {birthDateErrorWorker}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">연령</label>
                                    <input type="text" 
                                           className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" value={ageRep} readOnly
                                           placeholder="생년월일 입력 시 자동 적용 됩니다."
                                           readOnly
                                           value={ageWorker}
                                    />
                                </div>
                                {/* 성별 선택 박스 */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">성별</label>
                                    <select className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg appearance-none cursor-pointer" defaultValue="여성" >
                                        <option value="남성">남성</option>
                                        <option value="여성">여성</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">활동유형</label>
                                    <select className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg appearance-none cursor-pointer">
                                        <option value="선택">선택</option>
                                        <option value="마을공동체">유보수직</option>
                                        <option value="사회적협동조합">단기계약직</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">E-메일</label>
                                    <input type="email" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" defaultValue="" />
                                </div>
                            </div>
                        </section>

                        {/* 섹션 3: 운영 및 설립 정보 */}
                        <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                <h3 className="text-xl font-bold text-gray-950">설립 및 목적</h3>
                            </div>

                            {/* 상단 4분할 그리드 (선택 박스 적용) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {/* 1. 설립목적 선택 박스 */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">설립목적</label>
                                    <select className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg appearance-none cursor-pointer">
                                        <option value="선택">선택</option>
                                        <option value="일자리창출">일자리창출</option>
                                        <option value="주민화합">주민화합</option>
                                        <option value="주민소득창출">주민소득창출</option>
                                    </select>
                                </div>

                                {/* 2. 설립유형 선택 박스 */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">설립유형</label>
                                    <select className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg appearance-none cursor-pointer">
                                        <option value="선택">선택</option>
                                        <option value="소득창출형">소득창출형</option>
                                        <option value="마을화합형">마을화합형</option>
                                        <option value="문화자원형">문화자원형</option>
                                    </select>
                                </div>

                                {/* 3. 법인유형 선택 박스 */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">법인유형</label>
                                    <select className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg appearance-none cursor-pointer">
                                        <option value="선택">선택</option>
                                        <option value="마을회">마을회</option>
                                        <option value="영농조합법인">영농조합법인</option>
                                        <option value="사회적협동조합">사회적협동조합</option>
                                        <option value="정보화마을">정보화마을</option>
                                    </select>
                                </div>

                                {/* 4. 설립시기 선택 (년-월-일 달력 적용) */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">설립일자</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className={`w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-900 focus:ring-2 text-lg 
                                                      ${establishmentDateError ? 'border-2 border-red-500 focus:ring-red-100' : 'border-none focus:ring-blue-100'}`}
                                            value={formatBirthDate(establishmentDate)}
                                            onChange={(e) => handleBirthDateChange(e, setEstablishmentDate, setEstablishmentDateError)}
                                            onBlur={() => setEstablishmentDateError("")}
                                            placeholder="yyyy-mm-dd"
                                            maxLength="10"
                                        />
                                        {/* 에러 메시지 표시 구문 추가 */}
                                        {establishmentDateError && (
                                            <p className="mt-2 ml-2 text-red-500 text-sm font-semibold">
                                                {establishmentDateError}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 하단 주요 제품 및 활동 입력 영역 (이전 수정 내용 유지) */}
                            <div className="p-8 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-100 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-70 ml-1">주요 제품</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl font-bold text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30 text-lg backdrop-blur-md"
                                            defaultValue="썰매체험, 곤충체험, 산촌체험"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-70 ml-1">주요 활동</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl font-bold text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30 text-lg backdrop-blur-md"
                                            defaultValue="마을 자원을 활용한 계절별 체험 프로그램 위주 운영"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 섹션 4: 기타 정보 */}
                        <section className="p-8 bg-white rounded-3xl border border-gray-200 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* 홈페이지 정보 섹션 */}
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-400 ml-1">홈페이지(SNS) 유무</label>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {/* 선택 박스 (기본값: 없음) */}
                                        <select
                                            className="w-full sm:w-32 p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg appearance-none cursor-pointer"
                                            defaultValue="없음"
                                            onChange={(e) => {
                                                const inputWrapper = document.getElementById('homepage-input-wrapper');
                                                const noneText = document.getElementById('homepage-none-text');

                                                if (e.target.value === '있음') {
                                                    inputWrapper.classList.remove('hidden');
                                                    noneText.classList.add('hidden');
                                                } else {
                                                    inputWrapper.classList.add('hidden');
                                                    noneText.classList.remove('hidden');
                                                }
                                            }}
                                        >
                                            <option value="없음">없음</option>
                                            <option value="있음">있음</option>
                                        </select>

                                        {/* '있음' 선택 시 활성화되는 입력 박스 (기본값: 숨김) */}
                                        <div id="homepage-input-wrapper" className="flex-1 hidden">
                                            <input
                                                type="text"
                                                placeholder="https://example.com"
                                                className="w-full p-4 bg-blue-50/50 border border-blue-100 rounded-2xl font-bold text-blue-600 focus:ring-2 focus:ring-blue-200 text-lg"
                                            />
                                        </div>

                                        {/* '없음' 상태일 때 보여줄 기본 안내 문구 */}
                                        <div id="homepage-none-text" className="flex items-center">
                                            <span className="text-gray-400 text-sm font-medium ml-1">등록된 웹 주소가 없습니다.</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">공적자금 지원현황</label>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-transparent font-bold text-gray-900 text-sm">
                                        별도 탭(지원사업)에서 상세 내역 확인 가능
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === '지원사업' && (
                    <div className="space-y-8">
                        {/* 1. 요약 통계 카드 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                                <p className="text-sm font-bold text-blue-400 mb-1">총 지원 건수</p>
                                <p className="text-2xl font-black text-blue-700 text-center">6건</p>
                            </div>
                            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                                <p className="text-sm font-bold text-indigo-400 mb-1">누적 지원 금액</p>
                                <p className="text-2xl font-black text-indigo-700 text-center">838,600 <span className="text-sm font-bold">천원</span></p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 text-gray-400">
                                <p className="text-sm font-bold mb-1">최근 지원일</p>
                                <p className="text-2xl font-black italic text-center">2019.06.12</p>
                            </div>
                        </div>

                        {/* 2. 지원사업 상세 테이블 */}
                        <section>
                            <div className="flex items-center justify-between mb-6 px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                    <h3 className="text-xl font-bold text-gray-950">연도별 세부 지원내역</h3>
                                </div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Unit: KRW (1,000)</div>
                            </div>

                            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-x-auto">
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

                        {/* 3. 안내 문구 */}
                        <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-4">
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
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                <h3 className="text-xl font-bold text-gray-950">4. 매출액(만원) / 일자리 수(명)</h3>
                            </div>
                            <button className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
                                <span>➕</span> 매출등록
                            </button>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
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
                                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                    <h3 className="text-xl font-bold text-gray-950">장비(가공·집기) 지원현황</h3>
                                </div>
                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">단위: 천원</span>
                            </div>

                            {/* <div className="overflow-x-auto bg-white rounded-[32px] border border-blue-100 shadow-[0_10px_40px_rgba(37,99,235,0.15)] transition-all"> */}
                            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-200">
                                            <th className="px-6 py-5 text-[14px] font-bold text-gray-700 uppercase tracking-widest text-center w-16">연번</th>
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
                )
                }

                {
                    activeTab === '사업장 전경' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
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
                                        <div className="aspect-video bg-gray-100 rounded-3xl mb-3 overflow-hidden border border-gray-200 flex items-center justify-center text-gray-300 font-bold text-lg group-hover:bg-gray-200 transition-all">
                                            PHOTO AREA
                                        </div>
                                        <button className="absolute top-4 right-4 p-2.5 bg-red-500/90 hover:bg-red-600 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm" title="삭제">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
                    )
                }

                {
                    activeTab === '현장점검' && (
                        <div className="space-y-6">
                            {[
                                { date: '2026.04.08', visitor: '최현주 외 4명', content: '현실적으로 운영이 멈춘 상태로 보임. 마을이장 장종수님이 협의회 참석 예정' },
                                { date: '2021.03', visitor: '최은아 외 2명', content: '온난화로 인한 얼음 썰매장 개장 불가. 대체사업 발굴 및 컨설팅 추진 필요' },
                            ].map((log, i) => (
                                <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 relative overflow-hidden group">
                                    <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></div>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-blue-600 font-bold font-mono">{log.date}</span>
                                        <span className="text-xs font-bold text-gray-400 bg-white px-3 py-1 rounded-lg border border-gray-200">방문자: {log.visitor}</span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed font-medium">{log.content}</p>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div >
        </MainLayout >
    );
}
