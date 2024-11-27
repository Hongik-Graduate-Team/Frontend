import React, { useEffect, useCallback } from 'react';
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

    // API 요청 에러 핸들러
    const handleApiError = useCallback((error) => {
        if (error.response?.status === 401) {
            alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
            localStorage.removeItem('userToken');
            navigate('/signin');
        } else {
            console.error('API 요청 중 에러 발생:', error);
        }
    }, [navigate]); // navigate가 종속성에 포함됨

    // 인가 코드가 URL에 있는 경우 처리
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (code) {
            axios.get(`https://namanba.shop/login/oauth2/code/kakao?code=${code}`)
                .then((response) => {
                    const kakaoAccessToken = response.data.token;
                    localStorage.setItem('userToken', kakaoAccessToken);
                    navigate('/');
                })
                .catch((error) => {
                    console.error('카카오 로그인 처리 오류:', error);
                    alert('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
                });
        }
    }, [location, navigate]);

    // 공통적으로 API 요청 시 토큰 검증
    useEffect(() => {
        const userToken = localStorage.getItem('userToken');
        if (userToken) {
            axios.get('https://namanba.shop/api/validate-token', {
                headers: { Authorization: `Bearer ${userToken}` },
            }).catch((error) => handleApiError(error));
        }
    }, [handleApiError]); // handleApiError를 종속성에 추가

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
