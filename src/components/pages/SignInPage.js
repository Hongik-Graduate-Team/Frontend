import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import SignInHeader from '../molecules/Header/SignInHeader';
import kakaoLogo from '../../assets/img/kakaoLogo.png';

function SignInPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // 카카오 로그인 핸들러
    const handleKakaoLogin = () => {
        window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=c04b061bca7c5b2db4d80b65c8f684fe&redirect_uri=https://namanba.site/signin`;
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
                    localStorage.setItem('userToken', kakaoAccessToken);

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
                    <h1 className="mt-10 mb-10 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">로그인</h1>
                    <div className="flex justify-center">
                        <button
                            onClick={handleKakaoLogin}
                            className="flex items-center justify-center w-full p-3 mt-40 border border-gray-100 text-gray-500 font-semibold rounded-lg shadow-md hover:bg-yellow-300 hover:text-black">
                            <img src={kakaoLogo} alt="Kakao Logo" className="w-6 h-6 mr-2" />
                            <span>카카오계정 로그인</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
