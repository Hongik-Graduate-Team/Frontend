import React from 'react';
import { useNavigate } from 'react-router-dom';

function SignInHeader() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <header className="w-full p-4 bg-white flex justify-between items-center">
            <div className="text-xl font-bold text-gray-900">나만바</div>
            <div className="space-x-4">
                <button
                    onClick={() => handleNavigation('/')}
                    className="text-gray-900 hover:underline"
                >
                    나만바 소개
                </button>
                <button
                    onClick={() => handleNavigation('/signin')}
                    className="text-gray-900 hover:underline"
                >
                    로그인
                </button>
            </div>
        </header>
    );
}

export default SignInHeader;
