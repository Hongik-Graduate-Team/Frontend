import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/img/Logo.png";

function SignInHeader() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <header className="w-full p-4 bg-white flex justify-between items-center">
            <div>
                <img src={logo} alt="Logo" className="h-8 ml-3"
                onClick={() => handleNavigation('/')} /> {/* 로고 이미지 표시 */}
            </div>
            <div className="space-x-4">
                <button
                    onClick={() => handleNavigation('/signin')}
                    className="text-gray-600 hover:underline"
                >
                    로그인
                </button>
            </div>
        </header>
    );
}

export default SignInHeader;
