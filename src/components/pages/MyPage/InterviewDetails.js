import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function InterviewDetails({ interviewId }) {
    const [interviewDetails, setInterviewDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("userToken");

        const fetchInterviewDetails = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `https://namanba.shop/interviews/${interviewId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setInterviewDetails(response.data.data);
            } catch (error) {
                console.error("면접 상세 정보 로드 오류:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInterviewDetails();
    }, [interviewId]);

    // AM/PM 포맷 처리 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${date.toLocaleDateString()} ${formattedHours}:${minutes} ${ampm}`;
    };

    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center text-gray-500">로딩 중...</div>;
    }

    if (!interviewDetails) {
        return <div className="min-h-screen flex justify-center items-center text-gray-500">면접 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="min-h-screen p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto">
                {/* 제목 */}
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
                    {interviewDetails.interviewTitle}
                </h1>

                {/* 직군 */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">직군</h2>
                    <p className="text-lg text-gray-700 rounded-lg p-4">{interviewDetails.positionName}</p>
                </div>

                {/* 생성 날짜 */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">생성 날짜</h2>
                    <p className="text-lg text-gray-700 rounded-lg p-4">
                        {formatDate(interviewDetails.createdDate)}
                    </p>
                </div>

                {/* 질문 */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">질문</h2>
                    <ul className="list-disc list-inside space-y-4">
                        <li className="text-lg text-gray-800">{interviewDetails.basicInterview1}</li>
                        <li className="text-lg text-gray-800">{interviewDetails.basicInterview2}</li>
                        <li className="text-lg text-gray-800">{interviewDetails.basicInterview3}</li>
                        <li className="text-lg text-gray-800">
                            {interviewDetails.customQuestions || "커스텀 질문 없음"}
                        </li>
                    </ul>
                </div>

                {/* 평가 상태 및 정보 */}
                {interviewDetails.evaluationStatus === "IN_PROGRESS" ? (
                    <div className="mb-8 text-center text-red-500 text-xl font-bold">
                        면접이 완료되지 않았습니다.
                    </div>
                ) : (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">평가 정보</h2>
                        <ul className="list-inside space-y-4">
                            <li className="text-lg text-gray-800">
                                <strong>시선:</strong> {interviewDetails.gaze} ({interviewDetails.gazeMessage})
                            </li>
                            <li className="text-lg text-gray-800">
                                <strong>표정:</strong> {interviewDetails.expression} ({interviewDetails.expressionMessage})
                            </li>
                            <li className="text-lg text-gray-800">
                                <strong>제스처:</strong> {interviewDetails.gesture} ({interviewDetails.gestureMessage})
                            </li>
                            <li className="text-lg text-gray-800">
                                <strong>음성 크기:</strong> {interviewDetails.voiceVolume} ({interviewDetails.voiceVolumeMessage})
                            </li>
                            <li className="text-lg text-gray-800">
                                <strong>말 속도:</strong> {interviewDetails.speechRate} ({interviewDetails.speechRateMessage})
                            </li>
                            <li className="text-lg text-gray-800">
                                <strong>침묵 시간:</strong> {interviewDetails.silenceDuration} (
                                {interviewDetails.silenceDurationMessage})
                            </li>
                        </ul>
                    </div>
                )}

                {/* 이전 버튼 */}
                <div className="flex justify-center">
                    <button
                        onClick={() => navigate("/mypage")}
                        className="px-5 py-2 bg-indigo-500 text-white text-lg rounded-lg shadow hover:bg-indigo-600 transition"
                    >
                        이전
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InterviewDetails;
