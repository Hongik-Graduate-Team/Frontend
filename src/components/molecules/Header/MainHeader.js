import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/img/Logo.png';
import { AuthContext } from '../../../services/AuthContext';

function MainHeader({ isFormChanged }) {
    const { setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handlePageNavigation = (path) => {
        if (isFormChanged) {
            const confirmLeave = window.confirm('저장되지 않은 변경 사항이 있습니다. 정말로 페이지를 떠나시겠습니까?');
            if (confirmLeave) {
                navigate(path);  // navigate 사용
            }
        } else {
            navigate(path);  // navigate 사용
        }
    };


    const handleLogout = () => {
        if (isFormChanged) {
            const confirmLogout = window.confirm('저장되지 않은 변경 사항이 있습니다. 로그아웃하시겠습니까?');
            if (!confirmLogout) {
                return;
            }
        }

        localStorage.removeItem('userToken'); // 토큰 삭제
        setIsLoggedIn(false); // 로그아웃 시 로그인 상태를 갱신
        navigate('/') // 홈 페이지로 이동
    };

    return (
        <header className="w-full p-4 bg-white flex justify-center">
            <div className="w-full max-w-screen-xl flex justify-between items-center">
                <div>
                    <img src={logo} alt="Logo" className="h-8 ml-3 cursor-pointer"
                         onClick={() => handlePageNavigation('/')}>
                    </img>
                </div>
                <div className="space-x-4">
                    <button
                        onClick={() => handlePageNavigation('/mypage')}
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
