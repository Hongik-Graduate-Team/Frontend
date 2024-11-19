import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function InterviewDetails({ interviewId }) {
    const [interviewDetails, setInterviewDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
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

    const evaluationItems = [
        { title: "시선", value: interviewDetails.gaze, message: interviewDetails.gazeMessage },
        { title: "표정", value: interviewDetails.expression, message: interviewDetails.expressionMessage },
        { title: "제스처", value: interviewDetails.gesture, message: interviewDetails.gestureMessage },
        { title: "목소리 크기", value: interviewDetails.voiceVolume, message: interviewDetails.voiceVolumeMessage },
        { title: "발화 속도", value: interviewDetails.speechRate, message: interviewDetails.speechRateMessage },
        { title: "침묵 시간", value: interviewDetails.silenceDuration, message: interviewDetails.silenceDurationMessage },
    ];

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
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">면접 평가</h2>
                    {interviewDetails.evaluationStatus === "IN_PROGRESS" ? (
                        <div className="text-center text-red-500 text-xl font-bold">
                            평가가 완료되지 않았습니다.
                        </div>
                    ) : (
                        <ul className="space-y-6">
                            {evaluationItems.map((item, index) => (
                                <li key={index} className="text-lg text-gray-800">
                                    <div className="font-bold text-indigo-600">{item.title}: {item.value}점</div>
                                    <p className="text-gray-700 mt-1">{item.message}</p>
                                </li>
                            ))}
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


