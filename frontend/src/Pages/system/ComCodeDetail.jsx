import React, { useState, useEffect } from 'react';
import { X, Plus, RotateCcw, Edit } from 'lucide-react';

/**
 * ComCodeDetail - 상세코드 신규/수정 모달
 * 
 * Props:
 *   isOpen          {boolean}   - 모달 표시 여부
 *   onClose         {function}  - 모달 닫기 콜백
 *   onSuccess       {function}  - 저장 성공 후 콜백 (목록 새로고침 등)
 *   masterCode      {string}    - 현재 선택된 대분류 코드
 *   detailData      {object}    - 수정할 상세코드 데이터 (신규: null)
 */
export default function ComCodeDetail({ isOpen = false, onClose, onSuccess, masterCode, detailData = null }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const isEditMode = detailData !== null;

    const [formData, setFormData] = useState({
        master_cd: masterCode || '',
        dtl_cd: '',
        dtl_nm: '',
        sort_ord: 1,
        use_yn: 'Y',
    });

    // 데이터 초기화 - 수정 모드일 때 기존 데이터로 채우기
    useEffect(() => {
        if (isEditMode && detailData) {
            setFormData({
                master_cd: detailData.master_cd_id || masterCode,
                dtl_cd: detailData.dtl_cd || '',
                dtl_nm: detailData.dtl_nm || '',
                sort_ord: detailData.sort_ord || 1,
                use_yn: detailData.use_yn || 'Y',
            });
        } else {
            setFormData({
                master_cd: masterCode || '',
                dtl_cd: '',
                dtl_nm: '',
                sort_ord: 1,
                use_yn: 'Y',
            });
        }
        setErrors({});
    }, [isEditMode, detailData, masterCode]);

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'sort_ord' ? parseInt(value) || 0 : value
        }));
        // 해당 필드 에러 초기화
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // 유효성 검사
    const validate = () => {
        const newErrors = {};
        
        if (!formData.dtl_cd.trim()) {
            newErrors.dtl_cd = '상세코드를 입력하세요.';
        } else if (formData.dtl_cd.length > 50) {
            newErrors.dtl_cd = '상세코드는 50자 이하로 입력하세요.';
        }
        
        if (!formData.dtl_nm.trim()) {
            newErrors.dtl_nm = '상세코드명을 입력하세요.';
        } else if (formData.dtl_nm.length > 100) {
            newErrors.dtl_nm = '상세코드명은 100자 이하로 입력하세요.';
        }

        if (formData.sort_ord < 0) {
            newErrors.sort_ord = '정렬순서는 0 이상이어야 합니다.';
        }

        return newErrors;
    };

    // 초기화
    const handleReset = () => {
        if (isEditMode && detailData) {
            setFormData({
                master_cd: detailData.master_cd_id || masterCode,
                dtl_cd: detailData.dtl_cd || '',
                dtl_nm: detailData.dtl_nm || '',
                sort_ord: detailData.sort_ord || 1,
                use_yn: detailData.use_yn || 'Y',
            });
        } else {
            setFormData({
                master_cd: masterCode || '',
                dtl_cd: '',
                dtl_nm: '',
                sort_ord: 1,
                use_yn: 'Y',
            });
        }
        setErrors({});
    };

    // 등록/수정 제출
    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const url = isEditMode 
                ? '/system/comcode/detail/update/' 
                : '/system/comcode/detail/create/';
            
            const payload = isEditMode
                ? { ...formData, dtl_idx: detailData.dtl_idx }
                : formData;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                handleReset();
                if (onSuccess) onSuccess();
                if (onClose) onClose();
            } else {
                // 서버 유효성 에러 표시
                if (data.errors) setErrors(data.errors);
            }
        } catch (error) {
            console.error('등록/수정 오류:', error);
            setErrors({ general: '요청 중 오류가 발생했습니다.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 모달 외부 클릭 시 닫기
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            if (onClose) onClose();
        }
    };

    if (!isOpen) return null;

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)' }}
            onClick={handleBackdropClick}
        >
            {/* Modal Panel */}
            <div className="relative bg-white rounded-[6px] shadow-2xl border border-gray-100 w-full max-w-md mx-4 overflow-hidden"
                style={{ boxShadow: '0 32px 64px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(99,102,241,0.08)' }}
            >
                {/* 헤더 */}
                <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-gray-50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                            {isEditMode ? (
                                <Edit className="w-4 h-4 text-indigo-600" />
                            ) : (
                                <Plus className="w-4 h-4 text-indigo-600" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-base font-black text-gray-900 tracking-tight">
                                {isEditMode ? '상세코드 수정' : '상세코드 등록'}
                            </h2>
                            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                                {isEditMode ? '상세코드 정보를 수정합니다.' : '새로운 상세코드를 등록합니다.'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* 폼 바디 */}
                <div className="px-7 py-6 flex flex-col gap-5">

                    {/* 대분류 코드 (읽기 전용) */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                            대분류 코드
                        </label>
                        <input
                            type="text"
                            disabled
                            value={formData.master_cd}
                            className="px-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    {/* 상세코드 */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                            상세코드 <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="dtl_cd"
                            value={formData.dtl_cd}
                            onChange={handleChange}
                            placeholder="예) M, F, Y, N"
                            maxLength={50}
                            disabled={isEditMode}
                            className={`px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm transition-all outline-none
                                ${isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
                                ${errors.dtl_cd
                                    ? 'ring-2 ring-red-300 bg-red-50'
                                    : 'focus:ring-2 focus:ring-indigo-200'
                                }`}
                        />
                        {errors.dtl_cd && (
                            <p className="text-[11px] text-red-500 font-bold ml-1">{errors.dtl_cd}</p>
                        )}
                    </div>

                    {/* 상세코드명 */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                            상세코드명 <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="dtl_nm"
                            value={formData.dtl_nm}
                            onChange={handleChange}
                            placeholder="예) 남성, 여성, 예, 아니오"
                            maxLength={100}
                            className={`px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm transition-all outline-none
                                ${errors.dtl_nm
                                    ? 'ring-2 ring-red-300 bg-red-50'
                                    : 'focus:ring-2 focus:ring-indigo-200'
                                }`}
                        />
                        {errors.dtl_nm && (
                            <p className="text-[11px] text-red-500 font-bold ml-1">{errors.dtl_nm}</p>
                        )}
                    </div>

                    {/* 정렬순서 */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                            정렬순서
                        </label>
                        <input
                            type="number"
                            name="sort_ord"
                            value={formData.sort_ord}
                            onChange={handleChange}
                            min="0"
                            className={`px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm transition-all outline-none
                                ${errors.sort_ord
                                    ? 'ring-2 ring-red-300 bg-red-50'
                                    : 'focus:ring-2 focus:ring-indigo-200'
                                }`}
                        />
                        {errors.sort_ord && (
                            <p className="text-[11px] text-red-500 font-bold ml-1">{errors.sort_ord}</p>
                        )}
                    </div>

                    {/* 사용여부 */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                            사용여부
                        </label>
                        <div className="flex gap-2">
                            {[
                                { value: 'Y', label: '사용', activeClass: 'bg-green-500 text-white shadow-md shadow-green-100' },
                                { value: 'N', label: '미사용', activeClass: 'bg-red-400 text-white shadow-md shadow-red-100' },
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, use_yn: opt.value }))}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all
                                        ${formData.use_yn === opt.value
                                            ? opt.activeClass
                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex gap-2.5 px-7 pb-7">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-all"
                        title="초기화"
                    >
                        <RotateCcw size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-black text-xs hover:bg-gray-50 transition-all"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            <Plus size={14} />
                        )}
                        {isEditMode ? '수정' : '등록'}
                    </button>
                </div>
            </div>
        </div>
    );
}