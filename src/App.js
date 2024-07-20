import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext'; // AuthProvider 가져오기
import SignInPage from './components/pages/SignInPage';
import SignUpPage from './components/pages/SignUpPage';
import HomePage from './components/pages/Homepage/HomePage';
import InputInfo from './components/pages/Inputinfo/InputInfo';
import MyPage from './components/pages/MyPage/MyPage';
import './index.css';

// Kakao SDK 초기화
window.Kakao.init('YOUR_KAKAO_JAVASCRIPT_KEY');

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/inputinfo" element={<InputInfo />} />
                    <Route path="/mypage" element={<MyPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
