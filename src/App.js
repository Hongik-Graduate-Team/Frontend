import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInPage from './components/pages/SignInPage.js';
import SignUpPage from './components/pages/SignUpPage.js';
import HomePage from './components/pages/HomePage.js';
import InputInfo from './components/pages/InputInfo.js';
import MyPage from './components/pages/MyPage';
import './index.css'

// Kakao SDK 초기화
window.Kakao.init('YOUR_KAKAO_JAVASCRIPT_KEY');

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/inputinfo" element={<InputInfo />} />
                <Route path="/mypage" element={<MyPage/>} />
            </Routes>
        </Router>
    );
}

export default App;