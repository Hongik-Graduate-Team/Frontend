// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import SignInHeader from '../molecules/Header/SignInHeader';
// import kakaoLogo from '../../assets/img/kakaoLogo.png';

// function SignInPage() {
//     const [loginData, setLoginData] = useState({
//         email: "",
//         password: ""
//     });

//     const navigate = useNavigate();
//     const location = useLocation();

//     const handleChange = (event) => {
//         const { name, value } = event.target;
//         setLoginData({ ...loginData, [name]: value });
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         try {
//             const response = await axios.post('/signin', loginData, { withCredentials: true });
//             console.log('서버 응답:', response.data);
//             navigate('/자소서 페이지');
//         } catch (error) {
//             console.error('서버 요청 오류:', error);
//             alert('로그인에 실패했습니다. 다시 시도해주세요.');
//         }
//     };

//     const handleKakaoLogin = () => {
//         const kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize?client_id=c04b061bca7c5b2db4d80b65c8f684fe&redirect_uri=https://main--namanbatest.netlify.app/signin&response_type=code";
//         window.location.href = kakaoAuthUrl;
//     };

//     const handleKakaoAuth = useCallback(async (code) => {
//         try {
//             console.log('전송할 인가 코드:', code);

//             const authResponse = await axios.get('https://namanba.shop/login/oauth2/code/kakao', {
//                 params: { code },
//                 withCredentials: true
//             });

//             console.log('인가 코드 처리 응답:', authResponse);

//             console.log('쿠키에 저장된 액세스 토큰:', Cookies.get('access_token'));

//             navigate('/자소서 페이지');
//         } catch (error) {
//             console.error('서버 요청 오류:', error);
//             if (error.response) {
//                 console.error('서버 응답 데이터:', error.response.data);
//                 console.error('서버 응답 상태:', error.response.status);
//                 console.error('서버 응답 헤더:', error.response.headers);
//             }
//             alert('로그인에 실패했습니다. 다시 시도해주세요.');
//             navigate('/signin');
//         }
//     }, [navigate]);



//     useEffect(() => {
//         const urlParams = new URLSearchParams(location.search);
//         const code = urlParams.get('code');
//         console.log('인가 코드:', code);

//         if (code) {
//             console.log('인가 코드가 존재하여 handleKakaoAuth 호출');
//             handleKakaoAuth(code);
//         } else {
//             console.log('인가 코드가 존재하지 않음');
//         }
//     }, [location, handleKakaoAuth]);

//     return (
//         <div className="flex flex-col">
//             <SignInHeader />
//             <div className="flex flex-1 items-center justify-center bg-white-100">
//                 <div className="w-full max-w-lg p-8 space-y-8">
//                     <h1 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">로그인</h1>
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">이메일</label>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 id="email"
//                                 value={loginData.email}
//                                 onChange={handleChange}
//                                 className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-indigo-500"
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">비밀번호</label>
//                             <input
//                                 type="password"
//                                 name="password"
//                                 id="password"
//                                 value={loginData.password}
//                                 onChange={handleChange}
//                                 className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-indigo-500"
//                                 required
//                             />
//                         </div>
//                         <div className="flex justify-center">
//                             <button
//                                 type="submit"
//                                 className="w-full p-3 mt-10 text-white font-semibold bg-indigo-500 rounded-lg shadow-lg hover:bg-indigo-600">
//                                 로그인
//                             </button>
//                         </div>
//                     </form>
//                     <div className="flex justify-center">
//                         <button
//                             onClick={handleKakaoLogin}
//                             className="flex items-center justify-center w-full p-3 mt-4 border border-gray-300 text-gray-500 font-semibold rounded-lg shadow-lg hover:bg-yellow-300 hover:text-black">
//                             <img src={kakaoLogo} alt="Kakao Logo" className="w-6 h-6 mr-2" />
//                             <span>카카오로 로그인</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SignInPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/signin', loginData, { withCredentials: true });
            console.log('서버 응답:', response.data);
            navigate('/자소서 페이지');
        } catch (error) {
            console.error('서버 요청 오류:', error);
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleKakaoLogin = async () => {
        try {
            const response = await axios.get('https://namanba.shop/api/auth/kakao-login', { withCredentials: true });
            if (response.status === 200) {
                const token = Cookies.get('Authorization');
                if (token) {
                    navigate('/자소서 페이지');
                }
            } else {
                alert('카카오 로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('카카오 로그인 오류:', error);
            alert('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
        }
    };

    useEffect(() => {
        // 쿠키에 저장된 토큰이 있는지 확인
        const token = Cookies.get('Authorization');
        if (token) {
            navigate('/자소서 페이지');
        }
    }, [navigate]);

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