import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { AuthContext } from '../../services/AuthContext';
import SignInHeader from '../molecules/Header/SignInHeader';
import kakaoLogo from '../../assets/img/kakaoLogo.png';

function SignInPage() {
    // const { setIsLoggedIn } = useContext(AuthContext); // 로그인 상태 업데이트 함수 가져오기
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

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
            console.log('서버 응답:', response.data);

            // 로그인 성공시 토큰 저장 및 로그인 상태 갱신
            const token = response.data.token; // 응답에서 토큰을 받아온다고 가정
            localStorage.setItem('userToken', token);
            // setIsLoggedIn(true);

            navigate('/자소서 페이지'); // 로그인 후 이동할 페이지로 리디렉트
        } catch (error) {
            console.error('서버 요청 오류:', error);
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 카카오 로그인 핸들러
    const handleKakaoLogin = () => {
        window.location.href = 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=c04b061bca7c5b2db4d80b65c8f684fe&redirect_uri=https://namanba.shop/login/oauth2/code/kakao';
    };

    return (
        <div className="flex flex-col">
            <SignInHeader />
            <div className="flex flex-1 items-center justify-center bg-white-100">
                <div className="w-full max-w-lg p-8 space-y-8">
                    <h1 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">로그인</h1>

                    {/* 이메일/비밀번호 로그인 폼 */}
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

                    {/* 카카오 로그인 버튼 */}
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

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import SignInHeader from '../molecules/Header/SignInHeader';
// import kakaoLogo from '../../assets/img/kakaoLogo.png';
//
// function SignInPage() {
//     const [loginData, setLoginData] = useState({ email: "", password: "" });
//     const navigate = useNavigate();
//
//     // 이메일과 비밀번호 입력 핸들러
//     const handleChange = (event) => {
//         const { name, value } = event.target;
//         setLoginData({ ...loginData, [name]: value });
//     };
//
//     // 이메일과 비밀번호로 로그인 제출 핸들러
//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         try {
//             const response = await axios.post('/signin', loginData, { withCredentials: true });
//             console.log('서버 응답:', response.data);
//
//             // 로그인 성공시 페이지 이동
//             navigate('/자소서 페이지'); // 로그인 후 이동할 페이지로 리디렉트
//         } catch (error) {
//             console.error('서버 요청 오류:', error);
//             alert('로그인에 실패했습니다. 다시 시도해주세요.');
//         }
//     };
//
//     // 카카오 로그인 핸들러
//     const handleKakaoLogin = () => {
//         // 카카오 로그인 요청
//         axios.get('https://namanba.shop/api/auth/kakao-login', {
//             withCredentials: true // 쿠키를 포함하도록 설정
//         })
//             .then(response => {
//                 // 응답 헤더에서 Authorization 토큰 추출
//                 const token = response.headers['authorization'];
//
//                 // 토큰을 localStorage에 저장
//                 localStorage.setItem('Authorization', token);
//
//                 // 메인 페이지로 리다이렉트
//                 navigate('/');
//             })
//             .catch(error => {
//                 console.error('카카오 로그인 실패:', error);
//                 alert('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
//             });
//     };
//
//     return (
//         <div className="flex flex-col">
//             <SignInHeader />
//             <div className="flex flex-1 items-center justify-center bg-white-100">
//                 <div className="w-full max-w-lg p-8 space-y-8">
//                     <h1 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">로그인</h1>
//
//                     {/* 이메일/비밀번호 로그인 폼 */}
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
//
//                     {/* 카카오 로그인 버튼 */}
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
//
// export default SignInPage;
