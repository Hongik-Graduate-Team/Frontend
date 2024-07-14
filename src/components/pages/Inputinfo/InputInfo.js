import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainHeader from '../../molecules/Header/MainHeader';
import PageOne from './Page1';
import PageTwo from './Page2';
import NavigationButtons from './NavButton';

function InputInfo() {
  const [page, setPage] = useState(1);  // 페이지 번호 상태 추가
  const [resumeData, setResumeData] = useState({
    jobType: '',
    questions: [{ question: '', answer: '' }],
    major: [''],
    gpa: [{ score:'', total:'' }],
    careers: [{ type: '', content: '', startDate: null, endDate: null }],
    stacks: [{ language: '', level: '' }],
    awards: [{ type: '', prize: '' }],
    certs: [{ type: '', date: null }],
    languageCerts: [{ type: '', level: '', date: null }],
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadRecentData();  // 컴포넌트가 마운트될 때 최근 입력 불러오기
  }, []);

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

  const handleItemChange = (section, index, e) => {
    const { value } = e.target;
    const updatedItems = resumeData[section].map((item, i) =>
      i === index ? { ...item, [e.target.name]: value } : item
    );
    setResumeData({ ...resumeData, [section]: updatedItems });
  };

  const addInputField = (section, newItem) => {
    setResumeData({
      ...resumeData,
      [section]: [...resumeData[section], newItem],
    });
  };

  const deleteInputField = (section, index) => {
    const updatedItems = resumeData[section].filter((item, i) => i !== index);
    setResumeData({ ...resumeData, [section]: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/inputInfo', resumeData);
      console.log('서버 응답:', response.data);
      navigate('/startInterview');
    } catch (error) {
      console.error('서버 요청 오류:', error);
    }
  };

  const loadRecentData = async () => {
    try {
      const response = await axios.get('/getRecentData');  // 서버에서 최근 데이터를 가져오는 API 호출
      setResumeData(response.data);
    } catch (error) {
      console.error('최근 데이터 불러오기 오류:', error);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const response = await axios.post('/saveDraft', resumeData);
      console.log('임시 저장 성공:', response.data);
    } catch (error) {
      console.error('임시 저장 오류:', error);
    }
  };

  return (
    <div>
      <MainHeader />
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-5 p-3">
        {page === 1 && (
          <PageOne
            resumeData={resumeData}
            handleChange={handleChange}
            handleItemChange={handleItemChange}
            addInputField={addInputField}
            deleteInputField={deleteInputField}
            handleDateChange={handleDateChange}
          />
        )}
        {page === 2 && (
          <PageTwo
            resumeData={resumeData}
            handleItemChange={handleItemChange}
            addInputField={addInputField}
            deleteInputField={deleteInputField}
          />
        )}
        <NavigationButtons
          page={page}
          setPage={setPage}
          handleSaveDraft={handleSaveDraft}
          handleSubmit={handleSubmit}  // handleSubmit 함수를 전달
        />
      </form>
    </div>
  );
}

export default InputInfo;
