import React from 'react';
import deleteIcon from '../../../assets/img/delete.png'
import addIcon from '../../../assets/img/add.png' 

function PageTwo({ resumeData, handleItemChange, addInputField, deleteInputField }) {
  return (
    <>
      <h2 className="mt-3 text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">자기소개서 입력
        <span className='text-red-400'> *</span>
      </h2>
      <div className="border-b border-gray-900/10 mt-3 mb-4"></div>
      <div className="mb-20">
        {resumeData.questions && resumeData.questions.map((question, index) => (
          <div key={index} className="mb-2">
            <input
              id={`question-${index}`}
              name="question"
              value={question.question}
              onChange={(e) => handleItemChange('questions', index, e)}
              placeholder="질문"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
            <div className="text-right mt-1">
              {resumeData.questions.length < 5 && index === resumeData.questions.length - 1 && (
                <button
                  type="button"
                  onClick={() => addInputField('questions', { question: '', answer: '' })}
                >
                  <img src={addIcon} alt="추가 아이콘" className='w-5'/>
                </button>
              )}
              {resumeData.questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteInputField('questions', index)}
                  className="ml-2"
                >
                  <img src={deleteIcon} alt="삭제 아이콘" className='w-5'/>
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
