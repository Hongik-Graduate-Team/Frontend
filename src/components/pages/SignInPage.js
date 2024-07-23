import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import SignInHeader from '../molecules/Header/SignInHeader';
import kakaoLogo from '../../assets/img/kakaoLogo.png';

function SignInPage() {
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const location = useLocation();

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
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=c04b061bca7c5b2db4d80b65c8f684fe&redirect_uri=https://deploy-preview-15--namanbatest.netlify.app/signin&response_type=code`;
        window.location.href = kakaoAuthUrl;
    };

    const handleKakaoAuth = useCallback(async (code) => {
        try {
            const authResponse = await axios.get(`http://3.35.186.197:8080/login/oauth2/code/kakao?code=${code}`);
            console.log('인가 코드 처리 응답:', authResponse.data);

            // 쿠키에서 액세스 토큰을 읽어옴
            const accessToken = Cookies.get('access_token');
            if (!accessToken) {
                throw new Error('액세스 토큰을 찾을 수 없습니다.');
            }
            console.log('쿠키에서 읽은 액세스 토큰:', accessToken);

            // 사용자 정보를 가져오기 위해 백엔드로 액세스 토큰을 전달
            const userInfoResponse = await axios.get('/api/auth/kakao-login', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log('사용자 정보 응답:', userInfoResponse.data);

            // // 닉네임을 받아서 보여주기
            // alert(`환영합니다, ${userInfoResponse.data.nickname}!`);

            // 로그인 성공 시 페이지 이동
            navigate('/자소서 페이지');
        } catch (error) {
            console.error('서버 요청 오류:', error);
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
            navigate('/signin');
        }
    }, [navigate]);

    // URL에서 인가 코드 파싱 및 처리
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        if (code) {
            handleKakaoAuth(code);
        }
    }, [location, handleKakaoAuth]);

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
