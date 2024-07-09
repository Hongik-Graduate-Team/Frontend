import React, { useState, useEffect } from 'react';
import PreviousInterviews from '../molecules/PreviousInterviews';
import EditProfile from '../molecules/EditProfile';
import MainHeader from "../molecules/MainHeader";
import Profile from '../../assets/img/Profile.png';
import InterviewList from '../../assets/img/InterviewList.png'; // PreviousInterviews 이미지 경로

function MyPage() {
    const [selectedMenu, setSelectedMenu] = useState('previousInterviews');

    useEffect(() => {
        // 페이지 로드 시 "이전 면접 결과"가 기본으로 선택되도록 설정
        setSelectedMenu('previousInterviews');
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <MainHeader />
            <div className="flex flex-1 bg-white">
                <aside className="w-64 bg-white p-4 shadow-md">
                    <ul>
                        <li
                            className={`flex items-center p-2 cursor-pointer rounded ${selectedMenu === 'previousInterviews' ? 'bg-gray-200' : ''}`}
                            onClick={() => setSelectedMenu('previousInterviews')}
                        >
                            <img src={InterviewList} className="w-6 h-6 mr-2" alt="이전 면접 조회" />
                            이전 면접 조회
                        </li>
                        <li
                            className={`flex items-center p-2 cursor-pointer rounded ${selectedMenu === 'editProfile' ? 'bg-gray-200' : ''}`}
                            onClick={() => setSelectedMenu('editProfile')}
                        >
                            <img src={Profile} className="w-6 h-6 mr-2" alt="내 정보 수정" />
                            내 정보 수정
                        </li>
                    </ul>
                </aside>
                <main className="flex-1 p-4 bg-white">
                    {selectedMenu === 'previousInterviews' && <PreviousInterviews />}
                    {selectedMenu === 'editProfile' && <EditProfile />}
                </main>
            </div>
        </div>
    );
}

export default MyPage;
