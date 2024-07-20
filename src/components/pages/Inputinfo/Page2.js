import React from 'react';

function PageTwo({ resumeData, handleItemChange, addInputField, deleteInputField }) {
  return (
    <>
      <h2 className="mt-3 text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">자기소개서 입력</h2>
      <div className="border-b border-gray-900/10 mt-3 mb-3"></div>
      <div className="mb-20">
        {resumeData.questions && resumeData.questions.map((question, index) => (
          <div key={index} className="mb-2">
            <input
              id={`question-${index}`}
              name="question"
              value={question.question}
              onChange={(e) => handleItemChange('questions', index, e)}
              placeholder="질문"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
            <textarea
              id={`answer-${index}`}
              name="answer"
              value={question.answer}
              onChange={(e) => handleItemChange('questions', index, e)}
              placeholder="답변"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              rows="5"
              required
            />
            <div className="text-right mt-2">
              {resumeData.questions.length < 5 && index === resumeData.questions.length - 1 && (
                <button
                  type="button"
                  onClick={() => addInputField('questions', { question: '', answer: '' })}
                  className="mr-3 text-sm text-blue-500 focus:outline-none"
                >
                  추가
                </button>
              )}
              {resumeData.questions.length > 1 && index === resumeData.questions.length - 1 && (
                <button
                  type="button"
                  onClick={() => deleteInputField('questions', index)}
                  className="text-sm text-red-400 focus:outline-none"
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default PageTwo;
