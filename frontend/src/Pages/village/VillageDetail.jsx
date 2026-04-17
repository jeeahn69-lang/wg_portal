import React, { useState } from 'react';
import MainLayout from "../../layouts/MainLayout";

export default function VillageDetail() {
    const [activeTab, setActiveTab] = useState('기본정보');
    const tabs = ['기본정보', '지원사업', '운영성과', '시설/장비', '사업장 전경', '현장점검'];

    return (
        <MainLayout>
            {/* 상단 헤더 섹션 */}
            <div className="flex items-center justify-between mb-8 p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-lg">관리번호 #58</span>
                        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tighter">밤티 마을 공동체</h1>
                    </div>
                    <p className="text-gray-500 font-medium">완주군 동상면 사봉리 밤티마을 관리카드</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all">임시저장</button>
                    <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">정보수정</button>
                </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex gap-2 mb-6 p-1.5 bg-gray-100/50 rounded-2xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 탭 콘텐츠 영역 */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
                {activeTab === '기본정보' && (
                    <div className="space-y-10">
                        {/* 섹션 1: 공동체 기본 인적사항 */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                <h3 className="text-xl font-bold text-gray-950">공동체 기본사항</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 ml-1">마을명 / 공동체법인명</label>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-semibold text-gray-900">
                                        동상면 사봉리 밤티마을 (밤티 마을)
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 ml-1">사업장 주소</label>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-semibold text-gray-900">
                                        완주군 동상면 사봉리
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 ml-1">관리번호</label>
                                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 font-bold text-blue-600">
                                        58
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 섹션 2: 대표자 정보 */}
                        <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                <h3 className="text-xl font-bold text-gray-950">마을대표 정보</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 ml-1">성명</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100" defaultValue="정종수" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 ml-1">직위</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100" defaultValue="대표" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 ml-1">연락처</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100" defaultValue="010-3655-8878" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 ml-1">활동유형</label>
                                    <div className="p-4 bg-gray-50 rounded-2xl font-semibold text-gray-700">무보수 명예직 (농업)</div>
                                </div>
                            </div>
                        </section>

                        {/* 섹션 3: 운영 및 설립 정보 */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                                <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">설립 및 목적</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 mb-1">설립목적 (유형)</p>
                                        <p className="text-lg font-bold text-gray-900">주민화합 <span className="text-blue-600 text-sm font-medium ml-2">(문화자원형)</span></p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 mb-1">법인유형 / 설립시기</p>
                                        <p className="text-lg font-bold text-gray-900">마을회 <span className="text-gray-400 text-sm font-medium ml-2">(2008년 설립)</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-100">
                                <h4 className="text-sm font-bold opacity-70 mb-4 uppercase tracking-wider">주요 제품 및 서비스</h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {['썰매체험', '곤충체험', '산촌체험'].map((item, idx) => (
                                        <span key={idx} className="px-4 py-2 bg-white/20 rounded-xl text-sm font-bold backdrop-blur-md">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs opacity-70">마을 자원을 활용한 계절별 체험 프로그램 위주 운영</p>
                            </div>
                        </section>

                        {/* 섹션 4: 기타 정보 */}
                        <section className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 ml-1">홈페이지(SNS) 유무</label>
                                    <div className="flex items-center gap-3">
                                        <span className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-black">없음</span>
                                        <span className="text-gray-400 text-sm font-medium">등록된 웹 주소가 없습니다.</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 ml-1">공적자금 지원현황</label>
                                    <p className="text-sm font-bold text-gray-900">별도 탭(지원사업)에서 상세 내역 확인 가능</p>
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
                                <p className="text-2xl font-black text-blue-700">11건</p>
                            </div>
                            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                                <p className="text-sm font-bold text-indigo-400 mb-1">누적 지원 금액</p>
                                <p className="text-2xl font-black text-indigo-700">838,600 <span className="text-sm font-bold">천원</span></p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-gray-400">
                                <p className="text-sm font-bold mb-1">최근 지원일</p>
                                <p className="text-2xl font-black italic">2019.06.12</p>
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

                            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="px-8 py-5 text-[13px] font-bold text-gray-400 uppercase tracking-widest w-24">지원년도</th>
                                            <th className="px-8 py-5 text-[13px] font-bold text-gray-400 uppercase tracking-widest">사업명</th>
                                            <th className="px-8 py-5 text-[13px] font-bold text-gray-400 uppercase tracking-widest text-right">지원액</th>
                                            <th className="px-8 py-5 text-[13px] font-bold text-gray-400 uppercase tracking-widest">주요 내용</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {[
                                            { year: '2008', name: '참살기좋은마을', price: '30,000', content: '생태공원조성' },
                                            { year: '2010', name: '파워빌리지', price: '45,600', content: '지하수개발, 몽골텐트 외 4건' },
                                            { year: '2011', name: '파워빌리지', price: '5,000', note: '썰매장 시설보수' },
                                            { year: '2011', name: '향토산업마을', price: '200,000', content: '사계절 밤티 산촌체험장 조성' },
                                            { year: '2012', name: '두레농장', price: '200,000', content: '하우스 3동, 저온저장고 등' },
                                            { year: '2013', name: '향토산업마을(보완)', price: '20,000', content: '장비 및 시설 보완' },
                                            { year: '2014', name: '마을공동체(소액)', price: '5,000', content: '마을 환경 정비' },
                                            { year: '2016', name: '창조적마을만들기', price: '121,000', content: '체험장 리모델링' },
                                            { year: '2018', name: '창조적마을만들기', price: '195,000', content: '광장 조성 및 쉼터 정비' },
                                            { year: '2019', name: '파워빌리지', price: '17,000', content: '데크 설치 및 시설 도색' },
                                        ].map((row, idx) => (
                                            <tr key={idx} className="hover:bg-blue-50/30 transition-all group">
                                                <td className="px-8 py-6 font-mono text-gray-400 font-bold">{row.year}</td>
                                                <td className="px-8 py-6 font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {row.name}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className="text-blue-600 font-black font-mono text-lg">{row.price}</span>
                                                </td>
                                                <td className="px-8 py-6 text-sm text-gray-500 font-medium leading-relaxed">
                                                    {row.content || row.note}
                                                </td>
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

                {activeTab === '시설/장비' && (
                    <div className="space-y-12">
                        {/* 1. 장비(가공·집기) 지원현황 (표 섹션) */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                    <h3 className="text-xl font-bold text-gray-950">장비(가공·집기) 지원현황</h3>
                                </div>
                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">단위: 천원</span>
                            </div>

                            <div className="overflow-x-auto bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="px-6 py-5 text-[13px] font-bold text-gray-400 uppercase tracking-widest text-center w-16">연번</th>
                                            <th className="px-6 py-5 text-[13px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">지원년도/사업</th>
                                            <th className="px-6 py-5 text-[13px] font-bold text-gray-400 uppercase tracking-widest">품목</th>
                                            <th className="px-6 py-5 text-[13px] font-bold text-gray-400 uppercase tracking-widest text-right">보조금</th>
                                            <th className="px-6 py-5 text-[13px] font-bold text-gray-400 uppercase tracking-widest">비고</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {[
                                            { id: 1, year: '2010년 파워빌리지', item: '체험마을 지하수개발', price: '20,000', note: '-' },
                                            { id: 2, year: '2010년 파워빌리지', item: '몽골텐트', price: '3,600', note: '2동' },
                                            { id: 3, year: '2010년 파워빌리지', item: '썰매장 안내간판', price: '5,600', note: '7개' },
                                            { id: 4, year: '2010년 파워빌리지', item: '장류 포장재', price: '2,000', note: '포장지, 용기, 스티커' },
                                            { id: 5, year: '2010년 파워빌리지', item: '두부체험틀', price: '300', note: '20개' },
                                            { id: 18, year: '2011년 파워빌리지', item: '썰매장 시설보수', price: '5,000', note: '-' },
                                        ].map((row) => (
                                            <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="px-6 py-5 text-center font-mono text-gray-400 text-sm">{row.id}</td>
                                                <td className="px-6 py-5 text-sm text-gray-500 font-semibold">{row.year}</td>
                                                <td className="px-6 py-5 font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{row.item}</td>
                                                <td className="px-6 py-5 text-right font-black text-blue-600 font-mono">{row.price}</td>
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
                                    <div className="aspect-video bg-gray-100 rounded-3xl mb-3 overflow-hidden border border-gray-100 flex items-center justify-center text-gray-300 font-bold text-lg group-hover:bg-gray-200 transition-all">
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
                )}

                {activeTab === '운영성과' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                <h3 className="text-xl font-bold text-gray-950">4. 매출액(백만원) / 일자리 수(명)</h3>
                            </div>
                            <button className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
                                <span>➕</span> 매출등록
                            </button>
                        </div>
                        
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-center">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-100">
                                        <th className="px-6 py-5 text-[14px] font-bold text-gray-700">연도별</th>
                                        <th className="px-6 py-5 text-[14px] font-bold text-gray-700">1분기</th>
                                        <th className="px-6 py-5 text-[14px] font-bold text-gray-700">2분기</th>
                                        <th className="px-6 py-5 text-[14px] font-bold text-gray-700">3분기</th>
                                        <th className="px-6 py-5 text-[14px] font-bold text-gray-700">4분기</th>
                                        <th className="px-6 py-5 text-[14px] font-black text-gray-800 bg-gray-100/50">연간</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {[
                                        { year: '2014년', q1: '/', q2: '/', q3: '/', q4: '/', annual: '0 / 0' },
                                        { year: '2015년', q1: '/', q2: '/', q3: '/', q4: '/', annual: '0 / 0' },
                                        { year: '2016년', q1: '/', q2: '/', q3: '/', q4: '/', annual: '20 / 10' },
                                        { year: '2017년', q1: '/', q2: '/', q3: '/', q4: '/', annual: '0 / 0' },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50/30 transition-all">
                                            <td className="px-6 py-5 font-bold text-gray-900 border-r border-gray-50 bg-gray-50/30">{row.year}</td>
                                            <td className="px-6 py-5 text-gray-500 font-medium">{row.q1}</td>
                                            <td className="px-6 py-5 text-gray-500 font-medium">{row.q2}</td>
                                            <td className="px-6 py-5 text-gray-500 font-medium">{row.q3}</td>
                                            <td className="px-6 py-5 text-gray-500 font-medium">{row.q4}</td>
                                            <td className="px-6 py-5 font-black text-blue-600 bg-blue-50/20 border-l border-gray-50">{row.annual}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === '현장점검' && (
                    <div className="space-y-6">
                        {[
                            { date: '2026.04.08', visitor: '최현주 외 4명', content: '현실적으로 운영이 멈춘 상태로 보임. 마을이장 장종수님이 협의회 참석 예정' },
                            { date: '2021.03', visitor: '최은아 외 2명', content: '온난화로 인한 얼음 썰매장 개장 불가. 대체사업 발굴 및 컨설팅 추진 필요' },
                        ].map((log, i) => (
                            <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative overflow-hidden group">
                                <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-blue-600 font-bold font-mono">{log.date}</span>
                                    <span className="text-xs font-bold text-gray-400 bg-white px-3 py-1 rounded-lg border border-gray-100">방문자: {log.visitor}</span>
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