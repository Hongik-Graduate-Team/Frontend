// src/pages/RedirectionPage.js
import React, { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function RedirectionPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // URL에서 인가 코드 파싱
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        console.log('인가 코드:', code);

        if (code) {
            // 인가 코드를 백엔드로 전달
            axios.post('http://3.35.186.197:8080/api/auth/kakao-login', { code })
                .then(response => {
                    console.log('인가 코드 처리 응답:', response.data);

                    // 액세스 토큰을 쿠키에 저장
                    Cookies.set('access_token', response.data.access_token, { expires: 7 });
                    console.log('쿠키에 저장된 액세스 토큰:', Cookies.get('access_token'));

                    // 로그인 성공 시 페이지 이동
                    navigate('/자소서 페이지');
                })
                .catch(error => {
                    console.error('서버 요청 오류:', error);
                    alert('로그인에 실패했습니다. 다시 시도해주세요.');
                    navigate('/signin');
                });
        } else {
            console.log('인가 코드가 존재하지 않음');
            navigate('/signin');
        }
    }, [navigate]);

    return (
        <div>
            <p>로그인 처리 중...</p>
        </div>
    );
}

export default RedirectionPage;