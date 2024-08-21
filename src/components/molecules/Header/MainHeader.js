import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/img/Logo.png';
import { AuthContext } from '../../services/AuthContext';

function MainHeader() {
    const { setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken'); // 토큰 삭제
        setIsLoggedIn(false); // 로그아웃 시 로그인 상태를 갱신
        navigate('/'); // 홈 페이지로 이동
    };

    return (
        <header className="w-full p-4 bg-white flex justify-center">
            <div className="w-full max-w-screen-xl flex justify-between items-center">
                <div>
                    <img src={logo} alt="Logo" className="h-8 ml-3 cursor-pointer"
                         onClick={() => handleNavigation('/')}>
                    </img>
                </div>
                <div className="space-x-4">
                    <button
                        onClick={() => handleNavigation('/mypage')}
                        className="text-gray-600 hover:underline"
                    >
                        마이페이지
                    </button>
                    <button
                        onClick={handleLogout}
                        className="text-gray-600 hover:underline"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </header>
    );
}

export default MainHeader;
