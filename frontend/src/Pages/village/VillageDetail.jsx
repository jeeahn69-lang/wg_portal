import React, { useState } from 'react';
import MainLayout from "../../layouts/MainLayout";

export default function VillageDetail() {
    const [activeTab, setActiveTab] = useState('기본정보');

    const tabs = ['기본정보', '지원사업', '시설/장비', '운영성과', '현장점검'];

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
                    <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 ml-1">공동체(법인)명</label>
                            <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 font-semibold" defaultValue="밤티 마을" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 ml-1">대표자 성명</label>
                            <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 font-semibold" defaultValue="정종수" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 ml-1">연락처</label>
                            <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 font-semibold" defaultValue="010-3655-8878" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 ml-1">설립시기</label>
                            <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 font-semibold" defaultValue="2008년 설립" />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-400 ml-1">주요제품 및 사업</label>
                            <textarea className="w-full p-4 bg-gray-50 border-none rounded-2xl h-32 focus:ring-2 focus:ring-blue-100 font-semibold" defaultValue="썰매체험, 곤충체험 등" />
                        </div>
                    </div>
                )}

                {activeTab === '지원사업' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="px-4 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">지원년도</th>
                                    <th className="px-4 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">사업명</th>
                                    <th className="px-4 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider text-right">지원액(천원)</th>
                                    <th className="px-4 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">주요내용</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[
                                    { year: '2008', name: '참살기좋은마을', amount: '30,000', content: '생태공원조성' },
                                    { year: '2011', name: '향토산업마을', amount: '200,000', content: '사계절 밤티 산촌체험장' },
                                    { year: '2019', name: '파워빌리지', amount: '17,000', content: '데크, 페인트 등 시설보수' },
                                ].map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-6 font-bold text-gray-900">{item.year}</td>
                                        <td className="px-4 py-6 text-gray-700 font-semibold">{item.name}</td>
                                        <td className="px-4 py-6 text-right font-mono text-blue-600 font-bold">{item.amount}</td>
                                        <td className="px-4 py-6 text-gray-500 text-sm font-medium">{item.content}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === '시설/장비' && (
                    <div className="space-y-12">
                        {/* 1. 사업장 전경 (이미지 섹션) */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                <h3 className="text-xl font-bold text-gray-950">사업장 전경</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { title: '외부 전경 (동상면 사봉리)', desc: '마을 공동체 및 썰매장 진입로' },
                                    { title: '내부 시설 (다목적체험관)', desc: '곤충 체험 및 실내 활동 공간' },
                                    { title: '만경강 발원샘', desc: '마을 스토리텔링 연계 자원' },
                                ].map((img, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <div className="aspect-video bg-gray-100 rounded-3xl mb-3 overflow-hidden border border-gray-100 flex items-center justify-center text-gray-300 font-bold text-lg group-hover:bg-gray-200 transition-all">
                                            PHOTO AREA
                                        </div>
                                        <h4 className="text-sm font-bold text-gray-800 ml-1">{img.title}</h4>
                                        <p className="text-xs text-gray-400 ml-1 mt-1 font-medium">{img.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 2. 장비(가공·집기) 지원현황 (표 섹션) */}
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