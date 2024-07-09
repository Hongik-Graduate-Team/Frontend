// src/components/PreviousInterviews.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PreviousInterviews() {
    const [interviewResults, setInterviewResults] = useState([]);

    useEffect(() => {
        // 컴포넌트가 마운트될 때 데이터를 가져옵니다.
        async function fetchInterviewResults() {
            try {
                const response = await axios.get('/api/interview-results'); // 실제 API 경로를 사용하세요.
                setInterviewResults(response.data);
            } catch (error) {
                console.error('데이터를 가져오는 동안 오류가 발생했습니다.', error);
            }
        }

        fetchInterviewResults();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">이전 면접 결과</h2>
            <div className="space-y-4">
                {interviewResults.map((result, index) => (
                    <div key={index} className="p-4 bg-white rounded shadow">
                        <h3 className="text-lg font-semibold">{result.company}</h3>
                        <p className="text-sm text-gray-500">{result.date}</p>
                        <p>{result.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PreviousInterviews;

