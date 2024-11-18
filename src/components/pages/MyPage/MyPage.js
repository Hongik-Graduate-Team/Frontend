import React, { useState, useEffect } from "react";
import PreviousInterviews from "./PreviousInterviews";
import EditProfile from "./EditProfile";
import InterviewDetails from "./InterviewDetails";
import MainHeader from "../../molecules/Header/MainHeader";
import Profile from "../../../assets/img/Profile.png";
import InterviewList from "../../../assets/img/InterviewList.png";

function MyPage() {
    const [selectedMenu, setSelectedMenu] = useState("previousInterviews"); // 현재 선택된 메뉴 상태
    const [selectedInterviewId, setSelectedInterviewId] = useState(null); // 선택된 면접 ID 상태

    useEffect(() => {
        setSelectedMenu("previousInterviews"); // 기본 메뉴 설정
    }, []);

    // 면접 ID를 선택했을 때 호출되는 함수
    const handleSelectInterview = (interviewId) => {
        setSelectedInterviewId(interviewId);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* 상단 헤더 */}
            <MainHeader />
            <div className="flex flex-1 bg-white">
                {/* 사이드바 */}
                <aside className="w-64 bg-white p-4 shadow-md">
                    <ul>
                        <li
                            className={`flex items-center p-2 cursor-pointer rounded ${
                                selectedMenu === "previousInterviews" ? "bg-gray-200" : ""
                            }`}
                            onClick={() => {
                                setSelectedMenu("previousInterviews");
                                setSelectedInterviewId(null); // 선택된 면접 초기화
                            }}
                        >
                            <img src={InterviewList} className="w-6 h-6 mr-2" alt="이전 면접 조회" />
                            이전 면접 조회
                        </li>
                        <li
                            className={`flex items-center p-2 cursor-pointer rounded ${
                                selectedMenu === "editProfile" ? "bg-gray-200" : ""
                            }`}
                            onClick={() => {
                                setSelectedMenu("editProfile");
                                setSelectedInterviewId(null); // 선택된 면접 초기화
                            }}
                        >
                            <img src={Profile} className="w-6 h-6 mr-2" alt="내 정보 수정" />
                            내 정보 수정
                        </li>
                    </ul>
                </aside>

                {/* 메인 컨텐츠 */}
                <main className="flex-1 p-4 bg-white">
                    {/* 이전 면접 조회 */}
                    {selectedMenu === "previousInterviews" && !selectedInterviewId && (
                        <PreviousInterviews onSelectInterview={handleSelectInterview} />
                    )}

                    {/* 면접 상세 정보 */}
                    {selectedMenu === "previousInterviews" && selectedInterviewId && (
                        <InterviewDetails />
                    )}

                    {/* 내 정보 수정 */}
                    {selectedMenu === "editProfile" && <EditProfile />}
                </main>
            </div>
        </div>
    );
}

export default MyPage;
