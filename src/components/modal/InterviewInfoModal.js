import React from 'react';
import interviewInfo from '../../assets/img/section2.png'; // 안내 이미지

const InterviewInfoModal = ({ isOpen, onClose, onProceed }) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-2/3 flex flex-col items-center">
                {/* 안내 이미지 */}
                <img src={interviewInfo} alt="Interview Info" className="mb-6 w-3/4 object-contain" />

                {/* 버튼 영역 */}
                <div className="flex justify-center space-x-4">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-500"
                    >
                        이전
                    </button>
                    <button 
                        onClick={onProceed} 
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewInfoModal;
