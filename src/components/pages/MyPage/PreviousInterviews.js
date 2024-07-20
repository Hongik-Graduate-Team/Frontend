// GET /api/interviews - 사용자별 면접 목록 조회
// GET /api/interviews/:id - 특정 면접의 상세 정보 조회
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PreviousInterviews({ onSelectInterview }) {
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await axios.get('/api/mypage/interview');
                setInterviews(response.data);
            } catch (error) {
                console.error('Error fetching interviews:', error);
            }
        };
        fetchInterviews();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">이전 면접 조회</h2>
            <ul>
                {interviews.map((interview) => (
                    <li
                        key={interview.interviewId}
                        onClick={() => onSelectInterview(interview.interviewId)}
                        className="p-4 border-b cursor-pointer hover:bg-gray-100"
                    >
                        <h3 className="text-xl font-semibold">{interview.interviewTitle}</h3>
                        <p>직군: {interview.Position}</p>
                        <p>날짜: {new Date(interview.date).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PreviousInterviews;

