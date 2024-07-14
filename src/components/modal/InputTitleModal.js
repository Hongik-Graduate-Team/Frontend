import React, { useState } from 'react';

const InputTitleModal = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');

    const handleSave = () => {
        onSave(title); // onSave 콜백 호출하여 면접 제목 저장 및 처리
        setTitle(''); // 저장 후 input 초기화
        onClose(); // 모달 닫기
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">면접 제목 입력</h2>
                <input
                    type="text"
                    value={title}
                    placeholder="사용할 면접 제목을 입력하세요."
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
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
