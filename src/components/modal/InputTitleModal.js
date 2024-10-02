import React, {useContext, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { InterviewContext } from '../../context/InterviewContext'; // Context 가져오기

const InputTitleModal = ({ isOpen, onClose }) => {
    const [localInterviewTitle, setLocalInterviewTitle] = useState(''); // 로컬 상태
    const { setInterviewTitle } = useContext(InterviewContext); // Context에서 setInterviewTitle 가져오기
    const navigate = useNavigate();

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('userToken'); // 로컬 스토리지에서 토큰 가져오기
            await axios.get('https://namanba.shop/api/interview', {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                params: { interviewTitle: localInterviewTitle  }
              });
            setInterviewTitle(localInterviewTitle); // 전역 상태에 저장
            setLocalInterviewTitle(''); // 로컬 상태 초기화
            onClose(); // 모달 닫기
            navigate('/interviewpreparation', { state: { localInterviewTitle } }); // interviewTitle을 페이지로 전달
        } catch (error) {
            console.error('Error saving interview title:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">면접 제목 입력</h2>
                <input
                    type="text"
                    value={localInterviewTitle}
                    placeholder="사용할 면접 제목을 입력하세요."
                    onChange={(e) => setLocalInterviewTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                    required
                />
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">취소</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-indigo-500 text-white rounded-lg">저장</button>
                </div>
            </div>
        </div>
    );
};

export default InputTitleModal;
