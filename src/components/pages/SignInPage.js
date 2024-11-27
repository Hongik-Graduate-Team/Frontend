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
        // 카카오 인증 페이지로 리다이렉트
        window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=c04b061bca7c5b2db4d80b65c8f684fe&redirect_uri=https://namanba.site/signin`;
    };

    // 2. 로그아웃 처리 함수
    const handleLogout = useCallback(() => {
        // localStorage에서 모든 토큰 관련 데이터 삭제
        localStorage.removeItem('userToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expireTime');
        // 로그인 페이지로 리다이렉트
        navigate('/signin');
    }, [navigate]);

    // 3. 액세스 토큰 갱신 함수
    const refreshAccessToken = useCallback(async () => {
        const refreshToken = localStorage.getItem('refreshToken'); // 저장된 리프레시 토큰 읽기
        if (!refreshToken) {
            console.error('리프레시 토큰이 없습니다. 로그아웃합니다.');
            handleLogout();
            return;
        }

        try {
            // 백엔드로 리프레시 토큰 요청 보내기
            const response = await axios.post('https://namanba.shop/refresh-token', { refreshToken });
            const { token: newAccessToken, expiresIn } = response.data;
            const expireTime = Date.now() + expiresIn; // 만료 시간 계산

            // 새 액세스 토큰과 만료 시간 저장
            localStorage.setItem('userToken', newAccessToken);
            localStorage.setItem('expireTime', expireTime);
            console.log('토큰 갱신 완료');
        } catch (error) {
            console.error('토큰 갱신 실패:', error);
            handleLogout(); // 갱신 실패 시 로그아웃
        }
    }, [handleLogout]);

    // 4. 주기적으로 토큰 만료 확인
    useEffect(() => {
        console.log('토큰 만료 확인 useEffect 실행'); // 디버깅 로그

        const interval = setInterval(() => {
            console.log('토큰 만료 확인 인터벌 실행'); // 주기적으로 확인 로그
            const expireTime = localStorage.getItem('expireTime'); // 만료 시간 읽기

            if (!expireTime) {
                console.error('만료 시간이 없습니다. 로그아웃합니다.');
                handleLogout();
                return;
            }

            console.log('현재 시간:', Date.now(), '만료 시간:', expireTime); // 현재 시간과 만료 시간 로그

            // 만료 시간을 현재 시간과 비교
            if (Date.now() >= expireTime) {
                console.log('액세스 토큰 만료. 갱신 시도 중...');
                refreshAccessToken(); // 만료된 경우 토큰 갱신
            }
        }, 120000); // 2분 간격으로 확인 (120000ms)

        return () => {
            console.log('토큰 만료 확인 인터벌 제거'); // 인터벌 제거 로그
            clearInterval(interval);
        };
    }, [refreshAccessToken, handleLogout]);


    // 5. Axios 요청 인터셉터 설정
    useEffect(() => {
        // 모든 요청에 Authorization 및 Refresh-Token 헤더 추가
        const requestInterceptor = axios.interceptors.request.use((config) => {
            const accessToken = localStorage.getItem('userToken');  // 액세스 토큰
            const refreshToken = localStorage.getItem('refreshToken');  // 리프레시 토큰

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;  // 액세스 토큰을 Authorization 헤더에 추가
            }

            if (refreshToken) {
                config.headers['Refresh-Token'] = refreshToken;  // 리프레시 토큰을 Refresh-Token 헤더에 추가
            }

            return config;
        });

        // 401 응답 발생 시 토큰 갱신 후 재요청 처리
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response, // 정상 응답은 그대로 반환
            async (error) => {
                const originalRequest = error.config;

                // 인증 실패(401) 및 첫 번째 시도인 경우 처리
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true; // 재요청 방지 플래그 설정
                    await refreshAccessToken(); // 토큰 갱신 시도
                    const token = localStorage.getItem('userToken');
                    if (token) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axios(originalRequest); // 갱신된 토큰으로 재요청
                    }
                }
                handleLogout(); // 실패 시 로그아웃
                return Promise.reject(error);
            }
        );

        return () => {
            // 컴포넌트 언마운트 시 인터셉터 제거
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [refreshAccessToken, handleLogout]);

    // 6. 카카오 인증 코드 처리
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code'); // URL에서 인증 코드 가져오기

        if (code) {
            console.log('받은 인가 코드:', code);

            // 인증 코드를 백엔드에 전달하여 토큰 요청
            axios.get(`https://namanba.shop/login/oauth2/code/kakao?code=${code}`)
                .then((response) => {
                    const { token: accessToken, refreshToken, expiresIn } = response.data;

                    // 토큰 데이터 저장
                    const expireTime = Date.now() + expiresIn; // 만료 시간 계산
                    localStorage.setItem('userToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('expireTime', expireTime);

                    console.log('받은 액세스 토큰:', accessToken);
                    console.log('토큰 만료 시간:', expireTime);

                    // 메인 페이지로 이동
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