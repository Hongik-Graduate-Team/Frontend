import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditProfile() {
    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: '',
        password: ''
    });

    const [editingField, setEditingField] = useState(null);

    useEffect(() => {
        // 로그인 한 사용자의 정보를 가져와서 userData 상태를 설정
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/user'); // 실제 API 경로로 변경
                setUserData(response.data);
            } catch (error) {
                console.error('사용자 정보 로드 오류:', error);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleEdit = (field) => {
        setEditingField(field);
    };

    const handleSave = (field) => {
        // 서버로 수정된 데이터 전송 로직 추가
        setEditingField(null);
    };

    const handleCancel = () => {
        // 편집 취소 로직 추가 (예: 원래 데이터를 다시 불러오기)
        setEditingField(null);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">내 정보 수정</h2>
            {['id', 'name', 'email', 'password'].map((field) => (
                <div key={field} className="mb-4 flex flex-col sm:flex-row sm:items-center">
                    <label className="block text-sm font-medium leading-6 text-gray-900 w-full sm:w-1/4 mb-2 sm:mb-0">
                        {field === 'id' ? '아이디' : field === 'name' ? '이름' : field === 'email' ? '이메일' : '비밀번호'}
                    </label>
                    {editingField === field ? (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full sm:w-3/4">
                            <input
                                type={field === 'password' ? 'password' : 'text'}
                                name={field}
                                value={userData[field]}
                                onChange={handleChange}
                                className="w-full sm:w-3/4 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-indigo-500 mb-2 sm:mb-0"
                            />
                            <button onClick={handleCancel} className="w-full sm:w-auto p-3 bg-white border border-gray-300 text-gray-900 rounded mb-2 sm:mb-0">
                                취소
                            </button>
                            <button onClick={() => handleSave(field)} className="w-full sm:w-auto p-3 bg-indigo-500 text-white rounded">
                                저장
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full sm:w-3/4">
                            <input
                                type={field === 'password' ? 'password' : 'text'}
                                value={userData[field]}
                                disabled
                                className="w-full sm:w-3/4 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-gray-100 mb-2 sm:mb-0"
                            />
                            <button onClick={() => handleEdit(field)} className="w-full sm:w-auto p-3 bg-indigo-500 text-white rounded">
                                편집
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default EditProfile;
