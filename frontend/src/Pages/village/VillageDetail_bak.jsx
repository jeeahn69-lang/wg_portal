import React, { useState } from 'react';
import MainLayout from "../../layouts/MainLayout";

export default function VillageDetail() {
    const [activeTab, setActiveTab] = useState('기본정보');
    const tabs = ['기본정보', '지원사업', '매출/일자리', '시설/장비', '사업장 전경', '현장점검'];

    return (
        <MainLayout>
            {/* 상단 헤더 섹션 (처음부터 블루 네온 적용된 버전) */}
            {/* <div className="flex items-center justify-between mb-8 p-8 bg-white rounded-3xl border border-blue-50/50 shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all hover:shadow-xl hover:border-blue-100"> */}
            <div className="flex items-center justify-between mb-8 p-8 bg-white rounded-3xl border border-blue-100 shadow-xl transition-all">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-lg">동상면</span>
                        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tighter">밤티마을</h1>
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
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 font-semibold text-gray-900 text-lg">
                                        밤티 마을
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">사업장 주소</label>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 font-semibold text-gray-900 text-lg">
                                        완주군 동상면 사봉리
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">공동체 법인명</label>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 font-semibold text-gray-900 text-lg">
                                        밤티마을 영농조합법인
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">세대수</label>
                                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 font-bold text-blue-600 text-lg">
                                        45 세대
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">주민수</label>
                                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 font-bold text-blue-600 text-lg">
                                        112 명
                                    </div>
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
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" defaultValue="정종수" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">직위</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" defaultValue="대표" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">연락처</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" defaultValue="010-3655-8878" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">연령</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" defaultValue="60세" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">성별</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" defaultValue="남성" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">E-메일</label>
                                    <input type="email" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" defaultValue="" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">활동유형</label>
                                    <div className="p-4 bg-gray-50 rounded-2xl font-semibold text-gray-700">무보수 명예직 (농업)</div>
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
                                    <label className="text-sm font-bold text-gray-400 ml-1">직위</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" defaultValue="" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">연락처</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" defaultValue="" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">연령</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" defaultValue="" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">성별</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" defaultValue="" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">E-메일</label>
                                    <input type="email" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" defaultValue="" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">활동유형</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg" defaultValue="" />
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
                                        <option value="주민화합">주민화합</option>
                                        <option value="소득증대">소득증대</option>
                                        <option value="복지증진">복지증진</option>
                                        <option value="기타">기타</option>
                                    </select>
                                </div>

                                {/* 2. 설립유형 선택 박스 */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">설립유형</label>
                                    <select className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg appearance-none cursor-pointer">
                                        <option value="선택">선택</option>
                                        <option value="문화자원형">문화자원형</option>
                                        <option value="자연경관형">자연경관형</option>
                                        <option value="체험위주형">체험위주형</option>
                                        <option value="소득사업형">소득사업형</option>
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
                                        <option value="비영리단체">비영리단체</option>
                                    </select>
                                </div>

                                {/* 4. 설립시기 선택 (년-월-일 달력 적용) */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">설립시기</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 text-lg appearance-none cursor-pointer"
                                            defaultValue="2008-01-01"
                                        />
                                        {/* 달력 아이콘 (커스텀 스타일 유지) */}
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
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