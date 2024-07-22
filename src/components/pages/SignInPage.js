import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignInHeader from '../molecules/Header/SignInHeader'; // 경로를 실제 파일 위치에 맞게 변경하세요.
import kakaoLogo from '../../assets/img/kakaoLogo.png'; // 이미지 파일을 import

function SignInPage() {
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/signin', loginData);
            console.log('서버 응답:', response.data);
            localStorage.setItem('access_token', response.data.access_token);
            navigate('/자소서 페이지'); // 로그인 성공 시 페이지 이동
        } catch (error) {
            console.error('서버 요청 오류:', error);
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleKakaoLogin = () => {
        window.Kakao.Auth.login({
            success: function(authObj) {
                console.log(authObj);
                window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: function(res) {
                        console.log(res);
                        axios.post('https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=c04b061bca7c5b2db4d80b65c8f684fe&redirect_uri=https://main--namanba.netlify.app/login/oauth2/code/kakao', {
                            kakaoId: res.id,
                            email: res.kakao_account.email,
                            nickname: res.properties.nickname,
                            accessToken: authObj.access_token // 카카오 액세스 토큰을 포함하여 백엔드로 전송
                        }).then(response => {
                            console.log('서버 응답:', response.data);
                            localStorage.setItem('access_token', response.data.access_token);
                            navigate('/자소서 페이지'); // 로그인 성공 시 페이지 이동
                        }).catch(error => {
                            console.error('서버 요청 오류:', error);
                            alert('로그인에 실패했습니다. 다시 시도해주세요.');
                        });
                    },
                    fail: function(error) {
                        console.log(error);
                        alert('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
                    }
                });
            },
            fail: function(err) {
                console.log(err);
                alert('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
            }
        });
    };

    return (
        <div className="flex flex-col">
            <SignInHeader />
            <div className="flex flex-1 items-center justify-center bg-white-100">
                <div className="w-full max-w-lg p-8 space-y-8">
                    <h1 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">로그인</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">이메일</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={loginData.email}
                                onChange={handleChange}
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">비밀번호</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={loginData.password}
                                onChange={handleChange}
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-indigo-500"
                                required
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-full p-3 mt-10 text-white font-semibold bg-indigo-500 rounded-lg shadow-lg hover:bg-indigo-600">
                                로그인
                            </button>
                        </div>
                    </form>
                    <div className="flex justify-center">
                        <button
                            onClick={handleKakaoLogin}
                            className="flex items-center justify-center w-full p-3 mt-4 border border-gray-300 text-gray-500 font-semibold rounded-lg shadow-lg hover:bg-yellow-300 hover:text-black">
                            <img src={kakaoLogo} alt="Kakao Logo" className="w-6 h-6 mr-2" />
                            <span>카카오로 로그인</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
