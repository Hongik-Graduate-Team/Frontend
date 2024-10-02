import React, { createContext, useState } from 'react';

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
    const [interviewTitle, setInterviewTitle] = useState('');

    return (
        <InterviewContext.Provider value={{ interviewTitle, setInterviewTitle }}>
            {children}
        </InterviewContext.Provider>
    );
};