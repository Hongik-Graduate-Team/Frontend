import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function InterviewDetails({ interviewId }) {
    const [interviewDetails, setInterviewDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        console.log(`Navigating to: ${path}`); // 디버깅을 위한 로그 추가
        navigate("/mypage", { replace: true }); // `replace` 옵션으로 히스토리를 덮어씌움
        // navigate(path);
        // window.location.href = path; // 강제 이동
    };

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

    const customQuestions = interviewDetails.customQuestions
        ? interviewDetails.customQuestions
            .split("\n")
            .map((question) => question.replace(/^\d+\.\s*/, "").trim())
            .filter((question) => question !== "")
        : [];

    return (
        <div className="min-h-screen p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
                    {interviewDetails.interviewTitle}
                </h1>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">직군</h2>
                    <p className="text-lg text-gray-700 rounded-lg p-4">{interviewDetails.positionName}</p>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">생성 날짜</h2>
                    <p className="text-lg text-gray-700 rounded-lg p-4">
                        {formatDate(interviewDetails.createdDate)}
                    </p>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">질문</h2>
                    <ul className="list-disc list-inside space-y-4">
                        <li className="text-lg text-gray-800">{interviewDetails.basicInterview1}</li>
                        <li className="text-lg text-gray-800">{interviewDetails.basicInterview2}</li>
                        <li className="text-lg text-gray-800">{interviewDetails.basicInterview3}</li>
                        {customQuestions.map((question, index) => (
                            <li key={index} className="text-lg text-gray-800">
                                {question}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">면접 평가</h2>
                    {interviewDetails.evaluationStatus === "IN_PROGRESS" ? (
                        <div className="text-center text-red-500 text-xl font-bold">
                            평가가 완료되지 않았습니다.
                        </div>
                    ) : (
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
                    )}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={() => handleNavigation("/mypage")}
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


