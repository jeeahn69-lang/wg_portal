import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from "../../layouts/MainLayout";
import { useTabs } from '../../context/TabContext';
import { Wallet, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function VillageInfoList({ regions = [] }) {
    const { addTab } = useTabs();

    // 검색 조건 및 상태 관리
    const [selectedRegion, setSelectedRegion] = useState('전체');
    const [searchVillage, setSearchVillage] = useState('');
    const [selectedCouncil, setSelectedCouncil] = useState('전체');
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 페이지네이션 관련 상태
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 
    const pageBlockSize = 10; 

    // 실시간 DB 데이터 요청 API 통신 함수
    const handleSearch = useCallback(async () => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams({
                region: selectedRegion,
                village: searchVillage,
                council: selectedCouncil
            }).toString();

            const response = await fetch(`/village/info-search-api/?${queryParams}`);
            if (!response.ok) {
                throw new Error(`데이터베이스 통신 오류 (상태코드: ${response.status})`);
            }
            const dbData = await response.json();
            
            setFilteredData(dbData);
            setCurrentPage(1); 
        } catch (error) {
            console.error("마을 데이터 로드 실패:", error);
            alert("서버에서 데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, [selectedRegion, searchVillage, selectedCouncil]);

    useEffect(() => {
        handleSearch();
    }, []);

    // 페이지네이션 데이터 계산 로직
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem); 
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // 페이지 번호 10개씩 쪼개기 계산
    const currentBlock = Math.ceil(currentPage / pageBlockSize);
    const startPage = (currentBlock - 1) * pageBlockSize + 1;
    const endPage = Math.min(startPage + pageBlockSize - 1, totalPages);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <MainLayout>
            {/* 타이틀 및 헤더 영역 */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-950 tracking-tighter flex items-center gap-2">
                        <Wallet className="w-6 h-6 text-yellow-500" />마을 공동체 현황
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">완주군 내 마을 공동체 상세내역 및 사업 현황을 실시간 조회합니다.</p>
                </div>
                <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
                    <span>📊</span> 엑셀 다운로드
                </button>
            </div>

            {/* 필터 검색 섹션 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 ml-1">읍·면 선택</label>
                        <select 
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="w-full p-4 bg-gray-100 border-none rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-100 cursor-pointer appearance-none"
                        >
                            <option value="전체">전체</option>
                            {regions.map((region) => (
                                <option key={region.code} value={region.name}>{region.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 ml-1">마을명</label>
                        <input 
                            type="text" 
                            value={searchVillage}
                            onChange={(e) => setSearchVillage(e.target.value)}
                            placeholder="마을 이름을 입력하세요" 
                            className="w-full p-4 bg-gray-100 border-none rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-100" 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 ml-1">공동체 협의회 회원</label>
                        <select 
                            value={selectedCouncil}
                            onChange={(e) => setSelectedCouncil(e.target.value)}
                            className="w-full p-4 bg-gray-100 border-none rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-100 cursor-pointer appearance-none"
                        >
                            <option value="전체">전체</option>
                            <option value="Y">회원</option>
                            <option value="N">비회원</option>
                        </select>
                    </div>

                    <div className="flex items-end justify-end">
                        <button 
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="w-full md:w-3/4 h-[52px] bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400"
                        >
                            {isLoading ? '조회 중...' : '조회하기'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 그리드 데이터 리스트 섹션 */}
            <div className="bg-white rounded-lg border border-blue-100 shadow-xl p-8 overflow-hidden">
                <div className="pb-8 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-400">
                        전체 <span className="text-blue-600">{filteredData.length}</span> 건 조회됨
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-4 text-sm font-bold text-gray-400">No.</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-400">읍면</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-400">마을명</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-400">공동체법인명</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-400">법인유형</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-400">회원여부</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-400">대표자</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-400">실무자</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-400">마을이장</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-400">주요제품</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-400 text-right">매출액(천원)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentItems.length > 0 ? (
                                currentItems.map((item, idx) => (
                                    <tr 
                                        key={item.vil_idx} 
                                        className="hover:bg-blue-50/50 transition-colors group cursor-pointer" 
                                        onClick={() => addTab({ 
                                            id: `village-info-${item.vil_idx}`, 
                                            title: `${item.village} 정보`, 
                                            path: '/village/card/', 
                                            villageName: item.village,
                                            vilMngNo: item.vil_mng_no   
                                        })}
                                    >
                                        <td className="px-6 py-4 font-mono text-gray-400 text-sm font-bold">
                                            {indexOfFirstItem + idx + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">{item.eubmyeon}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-950 font-bold group-hover:text-blue-600 transition-colors text-sm">{item.village}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-semibold">{item.corporation}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.cotype || item.type || '-'}</td>
                                        <td className="px-6 py-4 text-sm font-bold">
                                            {item.council_mbr_yn === 'Y' ? (
                                                <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">회원</span>
                                            ) : (
                                                <span className="text-gray-400 bg-gray-50 px-2 py-1 rounded text-xs">비회원</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-950 font-bold">{item.ceo}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{item.worker}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.villhead || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold">{item.product || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-blue-600 font-bold font-mono">{item.revenue}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="px-6 py-12 text-gray-400 font-medium text-sm">
                                        {isLoading ? '데이터베이스 조회 중...' : '조건에 맞는 정보가 존재하지 않습니다.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 🎯 [버그 수정 완료] 완벽한 정중앙 정렬 및 우측 텍스트 배치 콤보 레이아웃 */}
                {totalPages > 1 && (
                    <div className="relative flex flex-col md:flex-row items-center justify-center border-t border-slate-100 pt-6 mt-6 gap-4 w-full min-h-[40px]">
                        
                        {/* [가운데] 페이지네이션 네비게이션 바 (공간 제약 해제로 찌그러짐 현상 완벽 해결) */}
                        <nav aria-label="pagination" className="flex items-center justify-center gap-1.5 shrink-0 select-none">
                            {/* 맨 처음 페이지 버튼 (◀◀) */}
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:text-slate-900 h-9 w-9 shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                                title="맨 처음 페이지"
                            >
                                <ChevronsLeft className="h-4 w-4 text-slate-500" />
                            </button>

                            {/* 이전 페이지 버튼 (◀ 이전) */}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:text-slate-900 h-9 px-3 gap-1 shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                                title="이전 페이지"
                            >
                                <ChevronLeft className="h-4 w-4 text-slate-500" />
                                <span className="hidden md:inline text-slate-600 font-medium">이전</span>
                            </button>

                            {/* 숫자 페이지 블록 (1~10 단위) */}
                            <div className="flex items-center gap-1 shrink-0">
                                {pageNumbers.map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`inline-flex items-center justify-center rounded-md text-sm transition-all h-9 w-9 shrink-0 ${
                                            currentPage === page
                                                ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-100'
                                                : 'border border-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            {/* 다음 페이지 버튼 (다음 ▶) */}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:text-slate-900 h-9 px-3 gap-1 shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                                title="다음 페이지"
                            >
                                <span className="hidden md:inline text-slate-600 font-medium">다음</span>
                                <ChevronRight className="h-4 w-4 text-slate-500" />
                            </button>

                            {/* 맨 끝 페이지 버튼 (▶▶) */}
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:text-slate-900 h-9 w-9 shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                                title="맨 끝 페이지"
                            >
                                <ChevronsRight className="h-4 w-4 text-slate-500" />
                            </button>
                        </nav>

                        {/* [오른쪽 끝] 조회 결과 안내 (PC 버전에선 우측 절대좌표 고정, 모바일에선 아래에 정렬) */}
                        <div className="md:absolute md:right-0 text-center md:text-right whitespace-nowrap mt-2 md:mt-0">
                            <p className="text-xs text-slate-400 font-medium tracking-tight">
                                조회 결과 <span className="font-semibold text-slate-600">{filteredData.length}</span> 개 중{" "}
                                <span className="font-semibold text-slate-600">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)}</span> 표시
                            </p>
                        </div>

                    </div>
                )}
            </div>
        </MainLayout>
    );
}