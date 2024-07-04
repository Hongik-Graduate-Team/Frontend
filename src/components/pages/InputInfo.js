import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function InputInfo() {
  const [resumeData, setResumeData] = useState({
    jobType: '',
    questions: [{ question: '', answer: '' }],
    experience: [{ position: '', period: '' }],
    stacks: [''],
    certs: [''],
    languageCerts: [{ type: '', level: '' }],
    awards: [''],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData({ ...resumeData, [name]: value });
  };

  // 배열에 입력 값 추가
  const handleItemChange = (section, index, e) => {
    const { name, value } = e.target;
    const updatedItems = resumeData[section].map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setResumeData({ ...resumeData, [section]: updatedItems });
  };

   // 입력 필드 추가, 자소서는 항목 추가 최대 4개
   const addInputField = (section, newItem) => {
    setResumeData({
      ...resumeData,
      [section]: [...resumeData[section], newItem],
    });
  };
  // 항목 삭제
  const deleteInputField = (section, index) => {
    const updatedItems = resumeData[section].filter((item, i) => i !== index);
    setResumeData({ ...resumeData, [section]: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/inputInfo', resumeData);
      console.log('서버 응답:', response.data);
      navigate('/startInterview');  // 면접 시작 페이지로 이동
    } catch (error) {
      console.error('서버 요청 오류:', error);
    }
  };

  const loadRecentData = () => {
    // 최근 정보 불러오기
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-2">
    <h2 className="mt-10 text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">직군 선택</h2>
    <div class="border-b border-gray-900/10 mt-3 mb-3"></div>
    <div className="mb-4">
      <select
        id="position"
        name="position"
        value={resumeData.position}
        onChange={handleChange}
        className="w-1/2 p-3 mt-2 border border-gray-300 rounded-lg  focus:outline-none focus:ring-1 focus:ring-indigo-500"
        required
      >
        <option value="">직군을 선택하세요</option>
        <option value="developer">개발자</option>
      </select>
    </div>

    <div className="mb-4">
    <h2 className="mt-10 text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">자기소개서 입력</h2>
    <div class="border-b border-gray-900/10 mt-3 mb-3"></div>
    {resumeData.questions.map((question, index) => (
      <div key={index} className="mb-4">
        <input
          type="text"
          id={`question-${index}`}
          name={`question-${index}`}
          value={question.question}
          placeholder="질문"
          onChange={(e) => handleItemChange('questions', index, e)}
          className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
          />
        <textarea
          id={`answer-${index}`}
          name={`answer-${index}`}
          value={question.answer}
          placeholder="답변"
          onChange={(e) => handleItemChange('questions', index, e)}
          rows="5"
          className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        />
        {resumeData.questions.length > 1 && index === resumeData.questions.length - 1 && (
          <button
            type="button"
            onClick={() => deleteInputField('questions', index)}
            className="ml-2 self-end text-sm text-red-600 focus:outline-none">
              삭제
          </button>
        )}
        {resumeData.questions.length < 4 && index === resumeData.questions.length - 1 && (
        <button
          type="button"
          onClick={() => addInputField('questions', { question: '', answer: '' })}
          className="text-sm text-blue-600 focus:outline-none">
            질문 추가
        </button>
        )}
        </div>
      ))}
    </div>

    <h2 className="mt-10 text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">추가 정보 입력</h2>
    <div class="border-b border-gray-900/10 mt-3 mb-3"></div>


    <div className="flex justify-end space-x-4 mt-4">
      <button type="button" onClick={loadRecentData} className="bg-gray-200 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300">최근 입력 불러오기</button>
      <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600">저장하기</button>
    </div>
  </form>
  );
}

export default InputInfo;