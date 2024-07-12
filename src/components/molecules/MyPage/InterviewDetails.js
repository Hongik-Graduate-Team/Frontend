import React, { useState, useEffect } from 'react';
import axios from 'axios';

// GET /api/interviews - 사용자별 면접 목록 조회
// GET /api/interviews/:id - 특정 면접의 상세 정보 조회

function InterviewDetails({ interviewId }) {
    const [interviewDetails, setInterviewDetails] = useState(null);

    useEffect(() => {
        const fetchInterviewDetails = async () => {
            try {
                const response = await axios.get(`/api/interviews/${interviewId}`);
                setInterviewDetails(response.data);
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
            <h2 className="text-2xl font-bold mb-4">{interviewDetails.title}</h2>
            <p>날짜: {new Date(interviewDetails.date).toLocaleDateString()}</p>
            <p>직군: {interviewDetails.jobCategory}</p>
            <h3 className="text-xl font-semibold mt-4">면접 질문</h3>
            <ul>
                {interviewDetails.questions.map((question, index) => (
                    <li key={index} className="mb-2">
                        {question}
                    </li>
                ))}
            </ul>
            <h3 className="text-xl font-semibold mt-4">평가표</h3>
            <p>{interviewDetails.evaluation}</p>
        </div>
    );
}

export default InterviewDetails;
