import React, { createContext, useState, useEffect } from 'react';

// Context 생성
export const AuthContext = createContext();

// Provider 컴포넌트 생성
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 로그인 상태를 확인하는 함수 (실제 로그인 확인 로직으로 대체)
    useEffect(() => {
        const checkLoginStatus = async () => {
            // 실제 로그인 확인 로직으로 대체
            const loggedIn = !!localStorage.getItem('userToken');
            setIsLoggedIn(loggedIn);
        };
        checkLoginStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};
