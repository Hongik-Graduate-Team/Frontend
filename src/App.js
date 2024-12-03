import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext'; // AuthProvider 가져오기
import SignInPage from './components/pages/SignInPage';
import HomePage from './components/pages/Homepage/HomePage';
import InputInfo from './components/pages/Inputinfo/InputInfo';
import MyPage from './components/pages/MyPage/MyPage';
import InterviewPreparationPage from "./components/pages/Interview/InterviewPreparationPage";
import InterviewStartPage from "./components/pages/Interview/InterviewStartPage";
import Feedback from './components/pages/FeedbackPage';
import './index.css';
import { InterviewProvider } from "./context/InterviewContext";
import InterviewDetails from "./components/pages/MyPage/InterviewDetails";
import PreviousInterviews from "./components/pages/MyPage/PreviousInterviews";
import { setupAxiosInterceptors } from './services/AxiosClient'; // Axios 설정 가져오기

// Axios 인터셉터 초기화를 담당하는 컴포넌트
const AxiosInterceptorInitializer = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Axios 인터셉터 초기화
        setupAxiosInterceptors(navigate);
    }, [navigate]);

    return null; // 화면에 아무것도 렌더링하지 않음
};

function App() {
    return (
        <InterviewProvider>
            <AuthProvider>
                <Router>
                    {/* Axios 인터셉터 초기화 */}
                    <AxiosInterceptorInitializer />

                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/signin" element={<SignInPage />} />
                        <Route path="/inputinfo" element={<InputInfo />} />
                        <Route path="/mypage" element={<MyPage />} />
                        <Route path="/previousinterviews" element={<PreviousInterviews />} />
                        <Route path="/interviewdetails/:interviewId" element={<InterviewDetails />} />
                        <Route path="/interviewpreparation" element={<InterviewPreparationPage />} />
                        <Route path="/interviewstart" element={<InterviewStartPage />} />
                        <Route path="/feedback" element={<Feedback />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </InterviewProvider>
    );
}

export default App;
