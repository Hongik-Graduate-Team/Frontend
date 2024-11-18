import React, { useState, useEffect } from "react";
import PreviousInterviews from "./PreviousInterviews";
import EditProfile from "./EditProfile";
import InterviewDetails from "./InterviewDetails";
import MainHeader from "../../molecules/Header/MainHeader";
import Profile from "../../../assets/img/Profile.png";
import InterviewList from "../../../assets/img/InterviewList.png";

function MyPage() {
    const [selectedMenu, setSelectedMenu] = useState("previousInterviews");
    const [selectedInterviewId, setSelectedInterviewId] = useState(null);

    useEffect(() => {
        setSelectedMenu("previousInterviews");
    }, []);

    const handleSelectInterview = (interviewId) => {
        setSelectedInterviewId(interviewId); // 면접 ID 저장
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <MainHeader />
            <div className="flex flex-1 bg-white">
                <aside className="w-64 bg-white p-4 shadow-md">
                    <ul>
                        <li
                            className={`flex items-center p-2 cursor-pointer rounded ${
                                selectedMenu === "previousInterviews" ? "bg-gray-200" : ""
                            }`}
                            onClick={() => {
                                setSelectedMenu("previousInterviews");
                                setSelectedInterviewId(null); // 선택 초기화
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
                                setSelectedInterviewId(null); // 선택 초기화
                            }}
                        >
                            <img src={Profile} className="w-6 h-6 mr-2" alt="내 정보 수정" />
                            내 정보 수정
                        </li>
                    </ul>
                </aside>

                <main className="flex-1 p-4 bg-white">
                    {selectedMenu === "previousInterviews" && !selectedInterviewId && (
                        <PreviousInterviews onSelectInterview={handleSelectInterview} />
                    )}
                    {selectedMenu === "previousInterviews" && selectedInterviewId && (
                        <InterviewDetails interviewId={selectedInterviewId} /> /* ID 전달 */
                        )}
                    {selectedMenu === "editProfile" && <EditProfile />}
                </main>
            </div>
        </div>
    );
}

export default MyPage;
