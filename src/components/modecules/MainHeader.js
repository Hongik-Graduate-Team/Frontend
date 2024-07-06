import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/Logo.png';

function MainHeader() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <header className="w-full p-4 bg-white flex justify-between items-center">
            <div>
                <img src={logo} alt="Logo" className="h-8" />  {/* 로고 이미지 표시 */}
            </div>
            <div className="space-x-4">
                <button
                    onClick={() => handleNavigation('/mypage')}
                    className="text-gray-900 hover:underline"
                >
                    마이페이지
                </button>
                <button
                    onClick={() => handleNavigation('/signup')}
                    className="text-gray-900 hover:underline"
                >
                    로그아웃
                </button>
            </div>
        </header>
    );
}

export default MainHeader;
