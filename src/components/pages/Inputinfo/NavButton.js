import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import InputTitleModal from "../../modal/InputTitleModal";

function NavigationButtons({ page, setPage, handleSubmit, validateForm, isSubmitting }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSaveAndOpenModal = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      // 입력된 정보 저장
      const isSaveSuccessful = await handleSubmit(e);
      // 저장 후 모달창 열기
      if (isSaveSuccessful) {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error saving resume data:', error);
    }
  };

  const handleTempSave = async () => {
    try {
      // 임시 저장
      await handleSubmit(); // 임시 저장 처리
      alert('임시 저장되었습니다.');
    } catch (error) {
      console.error('Error saving resume data:', error);
    }
  };

  const handleStartInterview = async (title) => {
    try {
      // 제목을 백엔드로 전송
      await axios.post('/api/interviews', { title });
      navigate('/interviewpreparation', { state: { interviewTitle: title } });
    } catch (error) {
      console.error('제목 저장 오류:', error);
    }
  };

  return (
    <div className="relative mt-6 pb-30">
      {page > 1 && (
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 px-4 py-2 text-white bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          이전
        </button>
      )}
      {page === 2 && (
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            className="px-4 py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-500"
            onClick={handleTempSave}
            disabled={isSubmitting}
          >
            임시 저장
          </button>
          <button
            type="button"
            className="px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
            onClick={async (e) => handleSaveAndOpenModal(e)}
            disabled={isSubmitting}
          >
            저장 및 면접 시작
          </button>
        </div>
      )}
      {page < 2 && (
        <button
          type="button"
          onClick={() => setPage(page + 1)}
          style={{ marginBottom: '16px' }}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 px-4 py-2 mb-30 text-white bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          다음
        </button>
      )}
      <InputTitleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleStartInterview}
      />
    </div>
  );
}

export default NavigationButtons;