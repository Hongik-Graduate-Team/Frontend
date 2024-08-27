// GET /api/interviews - 사용자별 면접 목록 조회
// GET /api/interviews/:id - 특정 면접의 상세 정보 조회
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PreviousInterviews({ onSelectInterview }) {
    const [interviews, setInterviews] = useState([]);
    const [setKakaoToken] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        setKakaoToken(token);

        const fetchInterviews = async () => {
            try {
                const response = await axios.get('/api/mypage/interview', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setInterviews(response.data.data);
            } catch (error) {
                console.error('면접 목록 로드 오류:', error);
            }
        };
        fetchInterviews();
    }, [setKakaoToken]);

    if (interviews.length === 0) {
        return <div>No interviews found.</div>;
    }

    return (
        <ul>
            {interviews.map((interview) => (
                <li key={interview.id} onClick={() => onSelectInterview(interview.id)}>
                    <div>{interview.company}</div>
                    <div>{interview.position}</div>
                    <div>{new Date(interview.date).toLocaleDateString()}</div>
                </li>
            ))}
        </ul>
    );
}

export default PreviousInterviews;
