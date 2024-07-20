import React, { useState, useEffect } from 'react';
import axios from 'axios';

// GET /api/interviews - 사용자별 면접 목록 조회
// GET /api/interviews/:id - 특정 면접의 상세 정보 조회

function InterviewDetails({ interviewId }) {
    const [interviewDetails, setInterviewDetails] = useState(null);

    useEffect(() => {
        const fetchInterviewDetails = async () => {
            try {
                const response = await axios.get(`/api/mypage/interview/${interviewId}`);
                setInterviewDetails(response.data.data); // 응답 데이터의 'data' 속성 추출
            } catch (error) {
                console.error('Error fetching interview details:', error);
            }
        };
        fetchInterviewDetails();
    }, [interviewId]);

    if (!interviewDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{interviewDetails.company}</h2>
            <p>직군: {interviewDetails.position}</p>
            <p>날짜: {new Date(interviewDetails.date).toLocaleDateString()}</p>
            <p>상태: {interviewDetails.status}</p>
            <p>피드백: {interviewDetails.feedback}</p>
            <h3 className="text-xl font-semibold mt-4">면접 질문</h3>
            <ul>
                {interviewDetails.questions.map((question) => (
                    <li key={question.questionId} className="mb-2">
                        <p className="font-bold">{question.questionText}</p>
                        <p>{question.answer}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default InterviewDetails;
