import React, { useState, useEffect } from "react";
import axios from "axios";

function PreviousInterviews({ onSelectInterview }) {
    const [interviews, setInterviews] = useState([]); // 면접 목록
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

    // 날짜를 AM/PM 형식으로 변환하는 함수
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${date.toLocaleDateString()} ${formattedHours}:${minutes} ${ampm}`;
    };

    useEffect(() => {
        const fetchInterviews = async () => {
            const token = localStorage.getItem("userToken");
            try {
                const response = await axios.get('https://namanba.shop/interviews/lists', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        page: currentPage - 1, // 백엔드는 0부터 시작하는 페이지 인덱스를 사용
                        direction: "DESC"
                    }
                });

                const data = response.data.data;
                setInterviews(data.content); // 면접 목록 저장
                setTotalPages(data.totalPages); // 전체 페이지 수 설정
            } catch (error) {
                console.error("면접 목록 로드 오류:", error);
            }
        };
        fetchInterviews();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleInterviewClick = (interviewId) => {
        onSelectInterview(interviewId); // 부모 컴포넌트로 ID 전달
    };

    return (
        <div className="min-h-screen p-8">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-semibold text-indigo-600 mb-8">면접 이력</h1>
                {interviews.length === 0 ? (
                    <div className="text-center text-gray-500">면접 기록이 없습니다.</div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center p-2 border-b-2 font-semibold text-gray-700">
                            <span className="w-1/12">번호</span>
                            <span className="w-1/4">제목</span>
                            <span className="w-1/4">직군</span>
                            <span className="w-1/4">날짜</span>
                        </div>
                        <ul>
                            {interviews.map((interview, index) => (
                                <li
                                    key={interview.interviewId}
                                    onClick={() => handleInterviewClick(interview.interviewId)}
                                    className="flex justify-between items-center p-4 hover:bg-indigo-50 cursor-pointer border-b"
                                >
                                    <span className="w-1/12 text-gray-700 font-medium">
                                        {index + 1 + (currentPage - 1) * 10}
                                    </span>
                                    <span className="w-1/4 text-gray-800 font-medium">{interview.interviewTitle}</span>
                                    <span className="w-1/4 text-gray-600">{interview.positionName}</span>
                                    <span className="w-1/4 text-gray-500">
                                        {formatDateTime(interview.createdDate)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="flex justify-center items-center mt-10 space-x-16">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md mx-2 hover:bg-indigo-600 disabled:opacity-50"
                    >
                        이전
                    </button>
                    <span className="text-gray-700 font-semibold text-lg">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md mx-2 hover:bg-indigo-600 disabled:opacity-50"
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PreviousInterviews;
