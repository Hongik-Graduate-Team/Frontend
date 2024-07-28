import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import InputTitleModal from "../../modal/InputTitleModal";

function NavigationButtons({ page, setPage, handleSubmit, validateForm }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSaveAndOpenModal = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      // 입력된 정보 저장
      await handleSubmit(e);
      // 저장 후 모달창 열기
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error saving resume data:', error);
    }
  };

  const handleStartInterview = async (title) => {
    try {
      // 제목을 백엔드로 전송
      await axios.post('/api/interviews', { title });
      navigate('/signin'); // 면접 시작 페이지로 라우팅 (경로 수정 가능)
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
        <div className="flex justify-center">
          <button
            type="button"
            className="px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
            onClick={handleSaveAndOpenModal}
          >
            저장하고 면접 시작
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
