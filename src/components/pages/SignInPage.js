// import React, { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import SignInHeader from '../molecules/Header/SignInHeader';
// import kakaoLogo from '../../assets/img/kakaoLogo.png';
//
// function SignInPage() {
//     const navigate = useNavigate();
//     const location = useLocation();
//
//     // 카카오 로그인 핸들러
//     const handleKakaoLogin = () => {
//         window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=c04b061bca7c5b2db4d80b65c8f684fe&redirect_uri=https://namanba.site/signin`;
//     };
//
//     // 인가 코드가 URL에 있는 경우 처리
//     useEffect(() => {
//         const searchParams = new URLSearchParams(location.search);
//         const code = searchParams.get('code');
//
//         if (code) {
//             console.log('받은 인가 코드:', code); // 인가 코드 확인용 콘솔 출력
//
//             // GET 요청으로 인가 코드를 백엔드에 전달
//             axios.get(`https://namanba.shop/login/oauth2/code/kakao?code=${code}`)
//                 .then((response) => {
//                     // 백엔드 응답에서 카카오 액세스 토큰을 추출
//                     const kakaoAccessToken = response.data.token; // 응답 바디에서 토큰을 추출
//                     localStorage.setItem('userToken', kakaoAccessToken);
//
//                     // 카카오 액세스 토큰 확인용 콘솔 출력
//                     console.log('받은 카카오 액세스 토큰:', kakaoAccessToken);
//
//                     // 필요한 페이지로 이동
//                     navigate('/');
//                 })
//                 .catch((error) => {
//                     console.error('카카오 로그인 처리 오류:', error);
//                     alert('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
//                 });
//         }
//     }, [location, navigate]);
//
//     return (
//         <div className="flex flex-col">
//             <SignInHeader />
//             <div className="flex flex-1 items-center justify-center bg-white-100">
//                 <div className="w-full max-w-lg p-8 space-y-8">
//                     <h1 className="mt-10 mb-10 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">로그인</h1>
//                     <div className="flex justify-center">
//                         <button
//                             onClick={handleKakaoLogin}
//                             className="flex items-center justify-center w-full p-3 mt-40 border border-gray-100 text-gray-500 font-semibold rounded-lg shadow-md hover:bg-yellow-300 hover:text-black">
//                             <img src={kakaoLogo} alt="Kakao Logo" className="w-6 h-6 mr-2" />
//                             <span>카카오계정 로그인</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default SignInPage;

import React, { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import SignInHeader from '../molecules/Header/SignInHeader';
import kakaoLogo from '../../assets/img/kakaoLogo.png';

function SignInPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // 1. 카카오 로그인 요청 함수
    const handleKakaoLogin = () => {
        window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=c04b061bca7c5b2db4d80b65c8f684fe&redirect_uri=https://namanba.site/signin`;
    };

    // 2. 로그아웃 처리 함수
    const handleLogout = useCallback(() => {
        console.log('로그아웃 처리 중...');
        localStorage.removeItem('userToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expireTime');
        navigate('/signin');
    }, [navigate]);

    // 3. 액세스 토큰 갱신 함수
    const refreshAccessToken = useCallback(async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            console.error('리프레시 토큰 없음. 로그아웃 처리.');
            handleLogout();
            return;
        }

        try {
            const response = await axios.post('https://namanba.shop/refresh-token', null, {
                headers: { Authorization: `Bearer ${refreshToken}` }
            });
            const { token: newAccessToken, expiresIn } = response.data; // **expiresIn은 13자리 밀리초 값**

            // 새 액세스 토큰 및 만료 시간 저장
            localStorage.setItem('userToken', newAccessToken);
            localStorage.setItem('expireTime', expiresIn); // **백엔드에서 받은 13자리 값을 그대로 저장**
            console.log('토큰 갱신 완료. 새로운 만료 시간:', expiresIn);
        } catch (error) {
            console.error('토큰 갱신 실패:', error);
            handleLogout();
        }
    }, [handleLogout]);

    // 4. 토큰 만료 확인
    useEffect(() => {
        console.log('토큰 만료 확인 useEffect 실행');

        const interval = setInterval(() => {
            console.log('토큰 만료 확인 인터벌 실행');
            const expireTime = parseInt(localStorage.getItem('expireTime'), 10); // **숫자 변환**

            if (!expireTime) {
                console.error('만료 시간 없음. 로그아웃 처리.');
                handleLogout();
                return;
            }

            console.log('현재 시간:', Date.now(), '만료 시간:', expireTime);
            if (Date.now() >= expireTime) {
                console.log('토큰 만료됨. 갱신 시도.');
                refreshAccessToken();
            }
        }, 120000); // 2분 간격으로 실행

        return () => {
            console.log('토큰 만료 확인 인터벌 제거');
            clearInterval(interval);
        };
    }, [refreshAccessToken, handleLogout]);

    // 5. Axios 인터셉터 설정
    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use((config) => {
            const accessToken = localStorage.getItem('userToken');
            const refreshToken = localStorage.getItem('refreshToken');
            if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
            if (refreshToken) config.headers['Refresh-Token'] = refreshToken; // 리프레시 토큰 추가
            return config;
        });

        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    await refreshAccessToken();
                    const newAccessToken = localStorage.getItem('userToken');
                    if (newAccessToken) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return axios(originalRequest);
                    }
                }
                handleLogout();
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [refreshAccessToken, handleLogout]);

    // 6. 카카오 인증 코드 처리
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (code) {
            console.log('받은 인가 코드:', code);

            axios.get(`https://namanba.shop/login/oauth2/code/kakao?code=${code}`)
                .then((response) => {
                    const { token: accessToken, refreshToken, expiresIn } = response.data; // **expiresIn은 13자리 밀리초 값**

                    // 토큰 데이터 저장
                    localStorage.setItem('userToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('expireTime', expiresIn); // **13자리 밀리초 값 그대로 저장**

                    console.log('받은 액세스 토큰:', accessToken);
                    console.log('토큰 만료 시간:', expiresIn);

                    navigate('/');
                })
                .catch((error) => {
                    console.error('카카오 로그인 오류:', error);
                    alert('로그인에 실패했습니다. 다시 시도해주세요.');
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
