import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import SignInHeader from '../molecules/Header/SignInHeader';
import kakaoLogo from '../../assets/img/kakaoLogo.png';

function SignInPage() {
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const location = useLocation();

    // 이메일과 비밀번호 입력 핸들러
    const handleChange = (event) => {
        const { name, value } = event.target;
        setLoginData({ ...loginData, [name]: value });
    };

    // 이메일과 비밀번호로 로그인 제출 핸들러
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/signin', loginData, { withCredentials: true });
            const token = response.data.token;
            localStorage.setItem('userToken', token);
            navigate('/자소서 페이지');
        } catch (error) {
            console.error('서버 요청 오류:', error);
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 카카오 로그인 핸들러
    const handleKakaoLogin = () => {
        window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=c04b061bca7c5b2db4d80b65c8f684fe&redirect_uri=https://main--namanbatest.netlify.app/signin`;
    };

    // 인가 코드가 URL에 있는 경우 처리
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (code) {
            console.log('받은 인가 코드:', code); // 인가 코드 확인용 콘솔 출력

            // GET 요청으로 인가 코드를 백엔드에 전달
            axios.get(`https://namanba.shop/login/oauth2/code/kakao?code=${code}`)
                .then((response) => {
                    // 백엔드 응답에서 카카오 액세스 토큰을 추출
                    const kakaoAccessToken = response.data.token; // 응답 바디에서 토큰을 추출
                    localStorage.setItem('kakaoAccessToken', kakaoAccessToken);

                    // 카카오 액세스 토큰 확인용 콘솔 출력
                    console.log('받은 카카오 액세스 토큰:', kakaoAccessToken);

                    // 필요한 페이지로 이동
                    navigate('/');
                })
                .catch((error) => {
                    console.error('카카오 로그인 처리 오류:', error);
                    alert('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
                });
        }
    }, [location, navigate]);

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
                            <span>카카오 로그인</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
