import React, { useState, useEffect } from "react";
import axios from "axios";

function PreviousInterviews({ onSelectInterview }) {
    const [interviews, setInterviews] = useState([]); // 현재 페이지의 면접 목록
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수

    // 날짜 형식을 AM/PM 형식으로 변환하는 함수
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${date.toLocaleDateString()} ${formattedHours}:${minutes} ${ampm}`;
    };

    // 현재 페이지 데이터를 백엔드에서 가져오는 함수
    const fetchInterviews = async (page) => {
        const token = localStorage.getItem("userToken"); // 사용자 토큰 가져오기
        console.log(`백엔드 요청: 페이지 번호 ${page}`); // 현재 페이지 번호 출력

        try {
            const response = await axios.get('https://namanba.shop/interviews/lists', {
                headers: { Authorization: `Bearer ${token}` }, // 토큰을 Authorization 헤더에 추가
                params: {
                    page: page - 1, // 백엔드에서는 0부터 시작하는 페이지 번호 사용
                    // direction: "DESC" // 내림차순 정렬
                }
            });

            const data = response.data.data; // 백엔드에서 받은 데이터 추출
            console.log("백엔드에서 받은 데이터:", data); // 받은 전체 데이터 확인
            console.log("현재 페이지의 면접 목록:", data.content); // 현재 페이지의 면접 목록 확인
            console.log("총 페이지 수:", data.totalPages); // 총 페이지 수 확인

            setInterviews(data.content); // 현재 페이지의 면접 목록 상태 업데이트
            setTotalPages(data.totalPages); // 총 페이지 수 상태 업데이트
        } catch (error) {
            console.error("면접 목록 로드 오류:", error); // 요청 실패 시 에러 로그 출력
        }
    };

    // `currentPage`가 변경될 때마다 데이터를 요청
    useEffect(() => {
        console.log("useEffect 실행: 현재 페이지", currentPage); // 현재 페이지 변경 확인
        fetchInterviews(currentPage); // 현재 페이지 데이터 요청
    }, [currentPage]);

    // 페이지 변경 시 호출되는 함수
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            console.log(`페이지 변경: ${currentPage} -> ${newPage}`); // 페이지 변경 확인
            setCurrentPage(newPage); // 새로운 페이지 설정
        }
    };

    // 면접 클릭 시 부모 컴포넌트에 선택된 면접 ID 전달
    const handleInterviewClick = (interviewId) => {
        console.log(`면접 선택: ${interviewId}`); // 클릭한 면접 ID 확인
        onSelectInterview(interviewId); // 선택된 면접 ID를 부모 컴포넌트로 전달
    };

    return (
        <div className="min-h-screen p-8">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-semibold text-indigo-600 mb-8">면접 이력</h1>
                {/* 면접 목록이 없을 때 */}
                {interviews.length === 0 ? (
                    <div className="text-center text-gray-500">면접 기록이 없습니다.</div>
                ) : (
                    <div>
                        {/* 헤더 부분 */}
                        <div className="flex justify-between items-center p-2 border-b-2 font-semibold text-gray-700">
                            <span className="w-1/12">번호</span>
                            <span className="w-1/4">제목</span>
                            <span className="w-1/4">직군</span>
                            <span className="w-1/4">날짜</span>
                        </div>
                        {/* 면접 목록 */}
                        <ul>
                            {interviews.map((interview, index) => (
                                <li
                                    key={interview.interviewId}
                                    onClick={() => handleInterviewClick(interview.interviewId)}
                                    className="flex justify-between items-center p-4 hover:bg-indigo-50 cursor-pointer border-b"
                                >
                                    {/* 번호 */}
                                    <span className="w-1/12 text-gray-700 font-medium">
                                        {index + 1 + (currentPage - 1) * 10} {/* 번호 계산 */}
                                    </span>
                                    {/* 제목 */}
                                    <span className="w-1/4 text-gray-800 font-medium">
                                        {interview.interviewTitle}
                                    </span>
                                    {/* 직군 */}
                                    <span className="w-1/4 text-gray-600">{interview.positionName}</span>
                                    {/* 날짜 */}
                                    <span className="w-1/4 text-gray-500">
                                        {formatDateTime(interview.createdDate)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* 페이지네이션 버튼 */}
                <div className="flex justify-center items-center mt-10 space-x-16">
                    {/* 이전 버튼 */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1} // 첫 페이지에서는 비활성화
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md mx-2 hover:bg-indigo-600 disabled:opacity-50"
                    >
                        이전
                    </button>
                    {/* 현재 페이지 표시 */}
                    <span className="text-gray-700 font-semibold text-lg">
                        {currentPage} / {totalPages}
                    </span>
                    {/* 다음 버튼 */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages} // 마지막 페이지에서는 비활성화
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


