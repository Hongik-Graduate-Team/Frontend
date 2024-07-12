import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignInHeader from '../molecules/Header/SignInHeader'; // SignInHeader 컴포넌트를 불러옵니다.

function SignUpPage() {
    const [memberData, setMemberData] = useState({
        id: "",
        name: "",
        email: "",
        password: "",
        password2: ""
    });

    const [isIdValid, setIsIdValid] = useState(null);
    const [validationMessage, setValidationMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setMemberData({ ...memberData, [name]: value });
    };

    const handleIdValidation = async () => {
        try {
            const response = await axios.post('/check-id-duplicate', { id: memberData.id });
            if (response.data.isDuplicate) {
                setIsIdValid(false);
                setValidationMessage("이미 사용 중인 아이디입니다.");
            } else {
                setIsIdValid(true);
                setValidationMessage("사용 가능한 아이디입니다.");
            }
        } catch (error) {
            console.error('서버 요청 오류:', error);
            setIsIdValid(false);
            setValidationMessage("아이디 중복 검사 중 오류가 발생했습니다.");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { password, password2 } = memberData;

        if (password !== password2) {
            return alert('비밀번호와 비밀번호 확인이 같지 않습니다.');
        }

        if (isIdValid === false || isIdValid === null) {
            return alert('아이디 중복 확인을 완료해 주세요.');
        }

        try {
            const response = await axios.post('/signup', memberData);
            console.log('서버 응답:', response.data);
            navigate('/signin');
        } catch (error) {
            console.error('서버 요청 오류:', error);
        }
    };

    return (
        <div className="flex flex-col bg-white-100">
            <SignInHeader /> {/* SignInHeader를 상단에 추가합니다. */}
            <div className="flex items-center justify-center flex-1">
                <div className="w-full mt-10 max-w-lg p-8 space-y-8">
                    <h1 className="text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">회원가입</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="id" className="block text-sm font-medium leading-6 text-gray-900">아이디</label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    name="id"
                                    id="id"
                                    value={memberData.id}
                                    onChange={handleChange}
                                    className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-indigo-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleIdValidation}
                                    className="p-3 bg-indigo-500 text-white rounded-lg shadow-lg hover:bg-indigo-600"
                                >
                                    중복 확인
                                </button>
                            </div>
                            {validationMessage && (
                                <p className={`mt-1 text-sm ${isIdValid ? 'text-green-500' : 'text-red-500'}`}>{validationMessage}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">이름</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={memberData.name}
                                onChange={handleChange}
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">이메일</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={memberData.email}
                                onChange={handleChange}
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-indigo-500"
                                required
                            />
                        </div>
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">비밀번호</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={memberData.password}
                                    onChange={handleChange}
                                    className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-indigo-500"
                                    required
                                />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="password2" className="block text-sm font-medium leading-6 text-gray-900">비밀번호 확인</label>
                                <input
                                    type="password"
                                    name="password2"
                                    id="password2"
                                    value={memberData.password2}
                                    onChange={handleChange}
                                    className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-indigo-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-1/2 p-3 mt-10 text-white font-semibold bg-indigo-500 rounded-lg shadow-lg hover:bg-indigo-600"
                            >
                                가입하기
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;

