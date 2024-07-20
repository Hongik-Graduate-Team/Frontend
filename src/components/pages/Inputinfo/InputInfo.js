import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainHeader from '../../molecules/Header/MainHeader';
import PageOne from './Page1';
import PageTwo from './Page2';
import NavigationButtons from './NavButton';

function InputInfo() {
  const [page, setPage] = useState(1);
  
  const [resumeData, setResumeData] = useState({
    positionName: '',
    questions: [{ question: '', answer: '' }],
    major: [''],
    gpa: { score: '', total: '' },
    careers: [{ careerType: '', content: '', startDate: null, endDate: null }],
    stacks: [{ stackLanguage: '', stackLevel: '' }],
    awards: [{ awardType: '', awardPrize: '' }],
    certs: [{ certType: '', certDate: null }],
    languageCerts: [{ languageCertType: '', languageCertLevel: '', languageCertDate: null }],
  });

  const navigate = useNavigate();

//  useEffect(() => {
//    loadRecentData(); // 컴포넌트가 마운트될 때 최근 입력 불러오기
//  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData({ ...resumeData, [name]: value });
  };

  const handleDateChange = (section, index, dateType, date) => {
    const updatedItems = [...resumeData[section]];
    updatedItems[index] = {
      ...updatedItems[index],
      [dateType]: date,
    };
    setResumeData({
      ...resumeData,
      [section]: updatedItems,
    });
  };

  const handleItemChange = (section, index, e) => {
    const { name, value } = e.target;
    const updatedItems = resumeData[section].map((item, i) =>
      i === index ? { ...item, [name]: value } : item
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

  const validateForm = () => {
    const requiredSections = ['positionName', 'questions'];
  
    // 필수 섹션 검사
    for (const section of requiredSections) {
      if (typeof resumeData[section] === 'string' && resumeData[section].trim() === '') {
        alert(`모든 필수 항목을 입력해 주세요. (${section})`);
        return false;
      }
  
      if (Array.isArray(resumeData[section])) {
        for (const item of resumeData[section]) {
          for (const field in item) {
            if (item[field] === null || item[field].trim() === '') {
              alert(`모든 항목을 채워 주세요.`);
              return false;
            }
          }
        }
      }
    }
  
    // 선택 섹션 검사
    const optionalSections = ['major', 'gpa', 'careers', 'stacks', 'awards', 'certs', 'languageCerts'];
  
    for (const section of optionalSections) {
      const isEmpty = resumeData[section].every(item =>
        Object.values(item).every(value => value === null || value.trim() === '')
      );
  
      if (!isEmpty) {
        for (const item of resumeData[section]) {
          for (const field in item) {
            if (item[field] === null || item[field].trim() === '') {
              alert(`모든 항목을 채워 주세요.`);
              return false;
            }
          }
        }
      }
    }
  
    return true;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
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
      const response = await axios.get('/getRecentData'); // 서버에서 최근 데이터를 가져오는 API 호출
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
          handleSubmit={handleSubmit}
          validateForm={validateForm}
        />
      </form>
    </div>
  );
}

export default InputInfo;
