import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
    return (
        <InterviewProvider>
            <AuthProvider>
                <Router>
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

