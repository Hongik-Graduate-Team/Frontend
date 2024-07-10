import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainHeader from '../molecules/MainHeader.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function InputInfo() {
  const [resumeData, setResumeData] = useState({
    jobType: '',
    questions: [{ question: '', answer: '' }],
    careers: [{ type: '', content: '', startDate: null, endDate: null }],
    stacks: [''],
    awards: [{ type: '', prize: '' }],
    certs: [''],
    languageCerts: [{ type: '', level: '' }],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData({ ...resumeData, [name]: value });
  };

  const handleDateChange = (section, index, dateType, date) => {
    const updatedItems = resumeData[section].map((item, i) =>
      i === index ? { ...item, [dateType]: date } : item
    );
    setResumeData({ ...resumeData, [section]: updatedItems });
  };

  // 배열에 입력 값 추가
  const handleItemChange = (section, index, e) => {
    const { value } = e.target;
    const updatedItems = resumeData[section].map((item, i) =>
      i === index ? value : item
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
    <div>
      <MainHeader />
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-2">
    <h2 className="mt-5 text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">직군 선택</h2>
    <div class="border-b border-gray-900/10 mt-3 mb-3"></div>
    <div className="mb-4">
      <select
        id="jobType"
        name="jobType"
        value={resumeData.position}
        onChange={handleChange}
        className="w-1/3 p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
          name={"question"}
          value={question.question}
          placeholder="질문"
          onChange={(e) => handleItemChange('questions', index, e)}
          className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
          />
        <textarea
          id={`answer-${index}`}
          name={"answer"}
          value={question.answer}
          placeholder="답변"
          onChange={(e) => handleItemChange('questions', index, e)}
          rows="5"
          className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        />
        {resumeData.questions.length < 5 && index === resumeData.questions.length - 1 && (
        <button
          type="button"
          onClick={() => addInputField('questions', { question: '', answer: '' })}
          className="mr-3 text-xs text-blue-600 focus:outline-none">
            질문 추가
        </button>
        )}
        {resumeData.questions.length > 1 && index === resumeData.questions.length - 1 && (
          <button
            type="button"
            onClick={() => deleteInputField('questions', index)}
            className="text-xs text-red-400 focus:outline-none">
              삭제
          </button>
        )}
        </div>
      ))}
    </div>

    <h2 className="mt-10 text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">추가 정보 입력</h2>
    <div className="border-b border-gray-900/10 mt-3 mb-3"></div>
    <div className="mb-4">
      <h3 className="mt-2 text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">경력 사항</h3>
      {resumeData.careers.map((career, index) => (
        <div key={index} className="mb-4">
          <div className="flex space-x-4">
            <select
              id={`type-${index}`}
              name="type"
              value={career.type}
              onChange={(e) => handleItemChange('careers', index, e)}
              className="w-1/5 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">구분</option>
              <option value="club">동아리</option>
              <option value="bootcamp">부트캠프</option>
              <option value="trainingProgram">교육 이수</option>
              <option value="intern">인턴</option>
              <option value="fulltime">정규직</option>
              <option value="freelancer">프리랜서</option>
            </select>
            <input
              type="text"
              id={`content-${index}`}
              name="content"
              value={career.content}
              placeholder="내용"
              onChange={(e) => handleItemChange('careers', index, e)}
              className="w-4/5 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <DatePicker
              selected={career.startDate}
              onChange={(date) => handleDateChange('careers', index, 'startDate', date)}
              selectsStart
              startDate={career.startDate}
              endDate={career.endDate}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholderText="시작 날짜"
            />
            <DatePicker
              selected={career.endDate}
              onChange={(date) => handleDateChange('careers', index, 'endDate', date)}
              selectsEnd
              startDate={career.startDate}
              endDate={career.endDate}
              minDate={career.startDate}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholderText="종료 날짜"
            />
          </div>
          {index === resumeData.careers.length - 1 && (
            <button
            type="button"
            onClick={() => addInputField('careers', { type: '', content: '', period: '' })}
            className="mr-3 text-xs text-blue-600 focus:outline-none"
          >
            추가
          </button>
        )}
          {index === resumeData.careers.length - 1 && resumeData.careers.length > 1 && (
            <button
              type="button"
              onClick={() => deleteInputField('careers', index)}
              className="text-xs text-red-400 focus:outline-none"
            >
              삭제
            </button>
          )}
        </div>
      ))}
    </div>

    <div className="mb-4">
        <h3 className="mt-2 text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">기술 스택</h3>
        {resumeData.stacks.map((stack, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              id={`stack-${index}`}
              value={stack}
              placeholder="스택"
              onChange={(e) => handleItemChange('stacks', index, e)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {index === resumeData.stacks.length - 1 && (
              <button
                type="button"
                onClick={() => addInputField('stacks', '')}
                className="mr-3 text-xs text-blue-600 focus:outline-none"
              >
                추가
              </button>
            )}
            {index === resumeData.stacks.length - 1 && resumeData.stacks.length > 1 && (
              <button
                type="button"
                onClick={() => deleteInputField('stacks', index)}
                className="text-xs text-red-400 focus:outline-none"
              >
                삭제
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mb-4">
      <h3 className="mt-2 text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">수상 내역</h3>
      {resumeData.awards.map((award, index) => (
        <div key={index} className="mb-4">
          <div className="flex space-x-4">
            <input
              type="text"
              id={`type-${index}`}
              name="type"
              value={award.type}
              placeholder="대회명"
              onChange={(e) => handleItemChange('awards', index, e)}
              className="w-2/3 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="text"
              id={`prize-${index}`}
              name="prize"
              value={award.prize}
              placeholder="입상 내역"
              onChange={(e) => handleItemChange('awards', index, e)}
              className="w-1/3 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {index === resumeData.awards.length - 1 && (
            <button
            type="button"
            onClick={() => addInputField('awards', { type: '', prize: '' })}
            className="mr-3 text-xs text-blue-600 focus:outline-none"
          >
            추가
          </button>
        )}
          {index === resumeData.languageCerts.length - 1 && resumeData.awards.length > 1 && (
            <button
              type="button"
              onClick={() => deleteInputField('awards', index)}
              className="text-xs text-red-400 focus:outline-none"
            >
              삭제
            </button>
          )}
        </div>
      ))}
    </div>

      <div className="mb-4">
        <h3 className="mt-2 text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">자격증</h3>
        {resumeData.certs.map((cert, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              id={`cert-${index}`}
              value={cert}
              placeholder="자격증명"
              onChange={(e) => handleItemChange('certs', index, e)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {index === resumeData.certs.length - 1 && (
              <button
                type="button"
                onClick={() => addInputField('certs', '')}
                className="mr-3 text-xs text-blue-600 focus:outline-none"
              >
                추가
              </button>
            )}
            {index === resumeData.certs.length - 1 && resumeData.certs.length > 1 && (
              <button
                type="button"
                onClick={() => deleteInputField('certs', index)}
                className="text-xs text-red-400 focus:outline-none"
              >
                삭제
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mb-10">
      <h3 className="mt-2 text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">어학 성적</h3>
      {resumeData.languageCerts.map((languageCert, index) => (
        <div key={index} className="mb-4">
          <div className="flex space-x-4">
            <input
              type="text"
              id={`type-${index}`}
              name="type"
              value={languageCert.type}
              placeholder="시험명"
              onChange={(e) => handleItemChange('languageCerts', index, e)}
              className="w-2/3 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="text"
              id={`level-${index}`}
              name="level"
              value={languageCert.level}
              placeholder="성적"
              onChange={(e) => handleItemChange('languageCerts', index, e)}
              className="w-1/3 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {index === resumeData.languageCerts.length - 1 && (
            <button
            type="button"
            onClick={() => addInputField('languageCerts', { type: '', level: '' })}
            className="mr-3 text-xs text-blue-600 focus:outline-none"
          >
            추가
          </button>
        )}
          {index === resumeData.languageCerts.length - 1 && resumeData.languageCerts.length > 1 && (
            <button
              type="button"
              onClick={() => deleteInputField('languageCerts', index)}
              className="text-xs text-red-400 focus:outline-none"
            >
              삭제
            </button>
          )}
        </div>
      ))}
    </div>


    <div className="flex justify-end space-x-4 mt-4">
      <button type="button" onClick={loadRecentData} className="bg-gray-200 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300">최근 입력 불러오기</button>
      <button type="submit" onClick={handleSubmit} className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600">저장하기</button>
    </div>
  </form>
  </div>
  );
}

export default InputInfo;