import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import SignInHeader from '../molecules/Header/SignInHeader';
import kakaoLogo from '../../assets/img/kakaoLogo.png';

function SignInPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Axios 인터셉터 설정
    useEffect(() => {
        // 요청 인터셉터
        const requestInterceptor = axios.interceptors.request.use((config) => {
            const accessToken = localStorage.getItem('userToken');
            const refreshToken = localStorage.getItem('refreshToken');
            if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
            if (refreshToken) config.headers['Refresh-Token'] = refreshToken; // 리프레시 토큰 추가
            return config;
        });

        // 응답 인터셉터
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response, // 정상 응답 처리
            async (error) => {
                // 401 상태 처리 (액세스 토큰 만료)
                if (error.response?.status === 401 && !error.config._retry) {
                    error.config._retry = true; // 무한 재시도를 방지
                    console.error('401 Unauthorized - 액세스 토큰 만료, 토큰 재발급 중...');

                    try {
                        const refreshToken = localStorage.getItem('refreshToken');
                        if (!refreshToken) {
                            throw new Error('리프레시 토큰이 없습니다.');
                        }

                        // 새 액세스 토큰 요청
                        const { data } = await axios.post(
                            'https://namanba.shop/refresh-token',
                            { refreshToken }
                        );

                        // 새 액세스 토큰 저장
                        localStorage.setItem('userToken', data.token);

                        // 원래 요청 다시 실행
                        error.config.headers.Authorization = `Bearer ${data.token}`;
                        return axios(error.config);
                    } catch (refreshError) {
                        console.error('토큰 재발급 실패:', refreshError);

                        // 로그아웃 처리
                        localStorage.removeItem('userToken');
                        localStorage.removeItem('refreshToken');
                        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                        navigate('/signin');
                        return Promise.reject(refreshError);
                    }
                }

                // 다른 에러 처리
                return Promise.reject(error);
            }
        );

        // 컴포넌트 언마운트 시 인터셉터 해제
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [navigate]);

    // 카카오 로그인 핸들러
    const handleKakaoLogin = () => {
        window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=c04b061bca7c5b2db4d80b65c8f684fe&redirect_uri=https://namanba.site/signin`;
    };

    // 인가 코드가 URL에 있는 경우 처리
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (code) {
            console.log('받은 인가 코드:', code);

            axios
                .get(`https://namanba.shop/login/oauth2/code/kakao?code=${code}`)
                .then((response) => {
                    const kakaoAccessToken = response.data.token; // 액세스 토큰
                    const refreshToken = response.data.refreshToken; // 리프레시 토큰

                    // 토큰 저장
                    localStorage.setItem('userToken', kakaoAccessToken);
                    localStorage.setItem('refreshToken', refreshToken);

                    console.log('받은 카카오 액세스 토큰:', kakaoAccessToken);
                    navigate('/'); // 메인 페이지로 이동
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
                    <h1 className="mt-10 mb-10 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">
                        로그인
                    </h1>
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
