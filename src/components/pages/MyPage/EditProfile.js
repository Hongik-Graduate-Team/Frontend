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
    const [kakaoToken, setKakaoToken] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        setKakaoToken(token);

        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
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

    const handleSave = async (field) => {
        try {
            await axios.put(`/api/user/${field}`, { [field]: userData[field] }, {
                headers: {
                    Authorization: `Bearer ${kakaoToken}`
                }
            });
            setEditingField(null);
        } catch (error) {
            console.error('저장 오류:', error);
        }
    };

    const handleCancel = () => {
        setEditingField(null);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">내 정보 수정</h2>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center">
                <label className="block text-m font-medium leading-6 text-gray-900 w-full sm:w-1/4 mb-2 sm:mb-0">
                    아이디
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full sm:w-3/4">
                    <input
                        type="text"
                        value={userData.id}
                        disabled
                        className="w-full sm:w-3/4 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-gray-100 mb-2 sm:mb-0"
                    />
                </div>
            </div>
            {['name', 'email', 'password'].map((field) => (
                <div key={field} className="mb-4 flex flex-col sm:flex-row sm:items-center">
                    <label className="block text-m font-medium leading-6 text-gray-900 w-full sm:w-1/4 mb-2 sm:mb-0">
                        {field === 'name' ? '이름' : field === 'email' ? '이메일' : '비밀번호'}
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

