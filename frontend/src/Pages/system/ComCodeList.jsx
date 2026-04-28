import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import MainLayout from "../../layouts/MainLayout";
import { useTabs } from '../../context/TabContext';
import { Database, Search, RotateCcw, Loader2, Trash2 } from 'lucide-react';
import ComCodeCreate from './ComCodeCreate';
import ComCodeDetail from './ComCodeDetail';
import Swal from 'sweetalert2';

export default function ComCodeManager({ masterList = [], detailList = [], searchParams: initialSearchParams = {} }) {
    const { addTab } = useTabs();
    const [selectedMaster, setSelectedMaster] = useState(null);
    const [detailsData, setDetailsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    
    // ComCodeDetail 모달 관련 상태
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);

    const [searchParams, setSearchParams] = useState({
        master_cd: initialSearchParams?.master_cd || '',
        master_nm: initialSearchParams?.master_nm || ''
    });

    const handleSearch = () => {
        router.get('/system/comcode', searchParams, {
            preserveState: true,
            replace: false
        });
    };

    const handleMasterClick = async (masterCode) => {
        setSelectedMaster(masterCode);
        setIsLoading(true);
        try {
            const response = await fetch(`/system/comcode/detail/${masterCode}/`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setDetailsData(data.success ? data.data : []);
        } catch (error) {
            console.error('Failed to fetch detail codes:', error);
            setDetailsData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setSearchParams({ master_cd: '', master_nm: '' });
    };

    const handleCreateSuccess = () => {
        router.reload({ preserveState: false });
    };

    // 상세코드 행 클릭
    const handleDetailRowClick = (detail) => {
        setSelectedDetail(detail);
        setIsDetailOpen(true);
    };

    // 상세코드 신규 추가
    const handleAddNewDetail = () => {
        setSelectedDetail(null);
        setIsDetailOpen(true);
    };

    // 상세코드 저장 성공
    const handleDetailSuccess = () => {
        // 현재 선택된 마스터 코드의 상세코드 목록 다시 조회
        if (selectedMaster) {
            handleMasterClick(selectedMaster);
        }
    };

    // 공통코드(마스터) 삭제 처리
    const handleDeleteMaster = async (masterCd) => {
        const result = await Swal.fire({
            title: '공통 코드를 삭제하시겠습니까?',
            text: "삭제 시 관련 상세 데이터가 모두 삭제될 수 있습니다.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            width: '520px'
        });

        if (result.isConfirmed) {
            try {

                // 호출 직전에 URL을 콘솔에 찍어서 404가 난 주소를 확인하세요.
                const url = `/system/comcode/master/delete/${masterCd}/`;
                console.log("요청 URL:", url);

                // urls.py에 정의할 경로와 일치해야 합니다.
                // const response = await fetch(`/system/comcode/master/delete/${masterCd}/`, {
                const response = await fetch(url,{
                    method: 'DELETE',
                    headers: {
                        'X-XSRF-TOKEN': document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '',
                    }
                });

                // 404 에러는 클라이언트에서 요청한 URL이 서버에서 정의된 URL 패턴과 일치하지 않을 때 발생합니다.
                if (response.status === 404) {
                throw new Error("404: 서버에서 삭제 경로를 찾을 수 없습니다. URL 설정을 확인하세요.");
                }

                const data = await response.json();

                if (data.success) {
                    await Swal.fire({
                        title: '삭제 완료',
                        icon: 'success',
                        timer: 1000,
                        showConfirmButton: false
                    });
                    
                    // 마스터 목록 새로고침 (기존 조회 함수 호출)
                    handleSearch(); 
                    // 상세 목록창 비우기
                    setDetailsData([]);
                    setSelectedMaster(null);
                } else {
                    Swal.fire('실패', data.message || '삭제 중 오류 발생', 'error');
                }
            } catch (error) {
                console.error('Master Delete Error:', error);
                Swal.fire('오류', '서버 통신 중 문제가 발생했습니다.', 'error');
            }
        }
    };


    // 상세코드 트레이스 클릭시 한행 삭제
    const handleDeleteDetail = async (dtlIdx) => {
        const result = await Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: "삭제 후에는 데이터를 복구할 수 없습니다.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            width: '520px',
            allowOutsideClick: false, // 아까 설정한 바깥 클릭 방지
            customClass: {
                title: 'text-xs font-bold',
                htmlContainer: 'text-xs',
                confirmButton: 'text-xs px-4 py-2',
                cancelButton: 'text-xs px-4 py-2'
            }
        });

        if (result.isConfirmed) {
            try {
                // 백엔드 삭제 API 호출 (URL은 프로젝트 API 명세에 맞게 확인하세요)
                const response = await fetch(`/system/comcode/detail/delete/${dtlIdx}/`, {
                    method: 'DELETE',
                    headers: {
                        'X-XSRF-TOKEN': document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '',
                    }
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire({
                        title: '삭제 완료',
                        icon: 'success',
                        width: '300px',
                        timer: 1000,
                        showConfirmButton: false
                    });
                    
                    // 삭제 성공 후 목록 새로고침 (기존에 만들어두신 성공 로직 재활용)
                    handleDetailSuccess();
                } else {
                    Swal.fire('실패', data.message || '삭제 중 오류가 발생했습니다.', 'error');
                }
            } catch (error) {
                console.error('Delete Error:', error);
                Swal.fire('오류', '서버와 통신 중 문제가 발생했습니다.', 'error');
            }
        }
    };

    return (
        <MainLayout>
            <div className="font-sans flex flex-col bg-gray-50/50 mb-8">

                {/* 상단 헤더 */}
                <div className="mb-6 flex justify-between items-end flex-shrink-0">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tighter flex items-center gap-2">
                            <Database className="w-6 h-6 text-cyan-500" />공통코드 관리
                        </h1>
                        <p className="text-gray-400 text-xs mt-1 font-medium">시스템 전반에서 사용되는 마스터 코드를 관리합니다.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl shadow-sm hover:bg-gray-50 font-bold text-xs transition-all">
                            엑셀 내보내기
                        </button>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 font-bold text-xs transition-all active:scale-95"
                        >
                            공통코드 등록
                        </button>
                    </div>
                </div>

                {/* 메인 그리드 */}
                <div className="flex gap-6 items-stretch">

                    {/* ── 왼쪽: 검색 + 공통코드 목록 ── */}
                    <div className="w-6/12 flex flex-col gap-6">

                        {/* 검색 카드 */}
                        <div className="bg-white rounded-[24px] border border-blue-100 shadow-xl p-5 flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-gray-400 ml-1 uppercase tracking-wider">코드</label>
                                        <input
                                            type="text"
                                            className="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-cyan-100 transition-all outline-none"
                                            value={searchParams.master_cd}
                                            onChange={(e) => setSearchParams({ ...searchParams, master_cd: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-gray-400 ml-1 uppercase tracking-wider">코드명</label>
                                        <input
                                            type="text"
                                            className="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-cyan-100 transition-all outline-none"
                                            value={searchParams.master_nm}
                                            onChange={(e) => setSearchParams({ ...searchParams, master_nm: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 self-end">
                                    <button onClick={handleReset} className="p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200">
                                        <RotateCcw size={18} />
                                    </button>
                                    <button onClick={handleSearch} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black shadow-md">
                                        <Search size={16} /> 조회
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 공통코드 목록 카드 - ✅ 고정 높이 + flex 구조로 스크롤 */}
                        <div className="bg-white rounded-[32px] border border-blue-100 shadow-xl flex flex-col h-full">
                            {/* 카드 헤더 - 고정 */}
                            <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex-shrink-0 rounded-t-[32px]">
                                <h3 className="font-black text-gray-800 flex items-center gap-2 text-lg">
                                    <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                                    공통코드 목록 ({masterList.length})
                                </h3>
                            </div>
                            {/* ✅ 스크롤 영역 - flex-1 + overflow-y-auto */}
                            <div className="flex-1 overflow-y-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
                                        <tr className="text-gray-400 text-sm uppercase font-black tracking-widest">
                                            <th className="px-8 py-4">코드</th>
                                            <th className="px-8 py-4">코드명</th>
                                            <th className="px-8 py-4 text-center">상태</th>
                                            <th className="px-8 py-4 text-center">삭제</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-gray-600">
                                        {masterList.length > 0 ? masterList.map((item) => 
                                        (
                                            <tr
                                                key={item.master_cd}
                                                onClick={() => handleMasterClick(item.master_cd)}
                                                className={`cursor-pointer transition-all border-b border-gray-50
                                                    ${selectedMaster === item.master_cd
                                                        ? 'bg-blue-50/80 font-bold border-l-4 border-l-blue-600'
                                                        : 'hover:bg-gray-50'}`}
                                            >
                                                <td className="px-8 py-4 text-gray-900">{item.master_cd}</td>
                                                <td className="px-8 py-4">{item.master_nm}</td>
                                                <td className="px-8 py-4 text-center">
                                                    <span className={`px-2 py-1 rounded-md text-[10px] font-black
                                                        ${item.use_yn === 'Y' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                        {item.use_yn === 'Y' ? '사용' : '미사용'}
                                                    </span>
                                                </td>
                                                {/* ✅ 추가: 삭제 버튼 칸 */}
                                                <td className="px-8 py-4 text-center">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // 부모 tr 클릭 이벤트 차단
                                                            handleDeleteMaster(item.master_cd);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110"      
                                                        strokeWidth={1.5} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-12 text-center text-gray-300 italic">데이터가 없습니다.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* ── 오른쪽: 상세코드 목록 ── */}
                    {/* ✅ 고정 높이 + flex 구조로 스크롤 */}
                    <div className="w-6/12 flex">
                        <div className="bg-white rounded-[32px] border border-blue-100 shadow-xl flex flex-col h-full w-full">    {/* 여기수정 위 2줄 ✅ 고정 높이 + flex 구조로 스크롤 */}
                            {/* 카드 헤더 - 고정 */}
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 flex-shrink-0 rounded-t-[32px]">
                                <h3 className="font-black text-gray-800 flex items-center gap-2 text-lg">
                                    <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
                                    상세코드 목록
                                    {selectedMaster && (
                                        <span className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-500 text-[12px] rounded-md tracking-tighter">
                                            {selectedMaster} ({detailsData.length})
                                        </span>
                                    )}
                                </h3>
                                <button 
                                    onClick={handleAddNewDetail}
                                    className="px-3 py-1.5 text-[13px] font-black bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                    + Add New Code
                                </button>
                            </div>
                            {/* ✅ 스크롤 영역 - flex-1 + overflow-y-auto */}
                            <div className="flex-1 overflow-y-auto">
                                {selectedMaster ? (
                                    isLoading ? (
                                        <div className="h-full flex flex-col items-center justify-center p-20">
                                            <Loader2 size={40} className="text-indigo-500 animate-spin mb-3" />
                                            <p className="text-gray-400 text-sm">조회 중...</p>
                                        </div>
                                    ) : (
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
                                                <tr className="text-gray-400 text-sm uppercase font-black tracking-widest">
                                                    <th className="px-8 py-4">상세코드</th>
                                                    <th className="px-8 py-4">상세코드명</th>
                                                    <th className="px-8 py-4 text-center">순서</th>
                                                    <th className="px-8 py-4 text-center">사용여부</th>
                                                    <th className="px-8 py-4 text-center">삭제</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm text-gray-600">
                                                {detailsData.length > 0 ? detailsData.map((item, idx) => (
                                                    <tr 
                                                        key={`${item.dtl_cd}-${idx}`} 
                                                        onClick={() => handleDetailRowClick(item)}
                                                        className="hover:bg-indigo-50/50 transition-colors border-b border-gray-50 cursor-pointer">
                                                        <td className="px-8 py-4 font-bold text-gray-900">{item.dtl_cd}</td>
                                                        <td className="px-8 py-4">{item.dtl_nm}</td>
                                                        <td className="px-8 py-4 text-center text-gray-500">{item.sort_ord}</td>
                                                        <td className="px-8 py-4 text-center">
                                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black
                                                            ${item.use_yn === 'Y' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                                {item.use_yn === 'Y' ? '사용' : '미사용'}
                                                            </span>
                                                        </td>
                                                        {/* ✅ 추가: 삭제 버튼 칸 */}
                                                        <td className="px-8 py-4 text-center">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // 👈 행 클릭 이벤트(수정 모달)가 발생하는 것을 막음
                                                                    handleDeleteDetail(item.dtl_idx);
                                                                }}
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all group"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110"
                                                                 strokeWidth={1.5} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-300 italic">등록된 상세 코드가 없습니다.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    )
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-50">
                                        <div className="text-4xl mb-4">📂</div>
                                        <p className="text-gray-400 text-xs font-bold">왼쪽에서 대분류를 선택하세요.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

                {/* 공통코드 등록 모달 */}
                <ComCodeCreate
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    onSuccess={handleCreateSuccess}
                />

                {/* 상세코드 신규/수정 모달 */}
                <ComCodeDetail
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    onSuccess={handleDetailSuccess}
                    masterCode={selectedMaster}
                    detailData={selectedDetail}
                />

        </MainLayout>
    );
}