import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import InputTitleModal from "../../modal/InputTitleModal";

function NavigationButtons({ page, setPage, handleSaveDraft, handleSubmit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSaveAndOpenModal = async (e) => {
    try {
      // 입력된 정보 저장
      await handleSubmit(e);

      // 저장 후 모달창 열기
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error saving resume data:', error);
      // 에러 처리 로직 추가 가능
    }
  };

  const handleStartInterview = async (title) => {
    try {
      // 제목을 백엔드로 전송
      await axios.post('/api/interviews', { title });

      // 모달창 닫기 (이미 모달에서 닫힘)
      navigate('/signin'); // 면접 시작 페이지로 라우팅 (경로 수정 가능)
    } catch (error) {
      console.error('Error saving interview title:', error);
      // 에러 처리 로직 추가 가능
    }
  };

  return (
    <div className="relative mt-6">
      {page > 1 && (
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 px-4 py-2 text-white bg-blue-400 rounded-lg hover:bg-blue-500"
        >
          이전
        </button>
      )}
      {page === 1 && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-500"
          >
            임시 저장
          </button>
        </div>
      )}
      {page === 2 && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 mr-2 text-white bg-gray-400 rounded-lg hover:bg-gray-500"
          >
            임시 저장
          </button>
          <button
            type="button"
            className="px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
            onClick={handleSaveAndOpenModal}
          >
            면접 시작
          </button>
        </div>
      )}
      {page < 2 && (
        <button
          type="button"
          onClick={() => setPage(page + 1)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 px-4 py-2 text-white bg-blue-400 rounded-lg hover:bg-blue-500"
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
