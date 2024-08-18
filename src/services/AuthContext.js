import React, { createContext, useState, useEffect } from 'react';

// Context 생성
export const AuthContext = createContext();

// Provider 컴포넌트 생성
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 로그인 상태를 확인하는 함수 (실제 로그인 확인 로직으로 대체)
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('userToken');
            setIsLoggedIn(!!token);
        };

        // 컴포넌트가 마운트될 때 로그인 상태 확인
        checkLoginStatus();

        // 로그인 상태를 지속적으로 확인하기 위해 'storage' 이벤트를 리스닝
        window.addEventListener('storage', checkLoginStatus);

        // 컴포넌트가 언마운트될 때 리스너 제거
        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};
