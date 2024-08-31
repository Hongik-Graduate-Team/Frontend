import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainHeader from '../../molecules/Header/MainHeader';
import PageOne from './Page1';
import PageTwo from './Page2';
import NavigationButtons from './NavButton';

function InputInfo() {
  const [page, setPage] = useState(1);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [kakaoToken, setKakaoToken] = useState(null);
  
  const [resumeData, setResumeData] = useState({
    position: '',
    questions: [{ resumeId: null, question: '', answer: '' }],
    majors: [{ majorId: null, majorName: '' }] ,
    gpas: { score: '', total: '' },
    careers: [{ careerId: null, careerType: '', content: '', startDate: null, endDate: null }],
    stacks: [{ stackId: null, stackLanguage: '', stackLevel: '' }],
    awards: [{ awardId: null, awardType: '', awardPrize: '' }],
    certifications: [{ certId: null, certType: '', certDate: null }],
    languageCerts: [{ languageCertId: null, languageCertType: '', languageCertLevel: '', languageCertDate: null }]
  });

  const [deletedItems, setDeletedItems] = useState({
    questions: [],
    majors: [],
    careers: [],
    stacks: [],
    awards: [],
    certifications: [],
    languageCerts: []
  });

  const navigate = useNavigate();

  // 컴포넌트가 마운트 될 때 데이터 불러오기
  useEffect(() => {
    const token = localStorage.getItem('userToken');  // 로컬 스토리지에서 토큰 가져오기
    if (token) {
      setKakaoToken(token);
      loadData(token);
    } else {
      console.error("토큰을 찾을 수 없습니다.");
    }
  }, []);

  // 데이터 가져오기
  const loadData = async (token) => {
    try {
      const response = await axios.get('https://namanba.shop/api/portfolio', {
        headers: {
          Authorization: `Bearer ${token}`  // 토큰을 헤더에 포함
        },
      });
      const data = response.data;
      console.log("fetched data:", data);

      if (data) {
        setResumeData({
          position: data.position || '',
          questions: Array.isArray(data.resumes) && data.resumes.length > 0 ? data.resumes : [{ resumeId: null, question: '', answer: '' }],
          majors: Array.isArray(data.majors) && data.majors.length > 0 ? data.majors : [{ majorId: null, majorName: '' }],
          gpas: data.gpas && data.gpas.length > 0 ? data.gpas[0] : { score: '', total: '' },
          careers: Array.isArray(data.careers) && data.careers.length > 0 ? data.careers : [{ careerId: null, careerType: '', content: '', startDate: null, endDate: null }],
          stacks: Array.isArray(data.stacks) && data.stacks.length > 0 ? data.stacks : [{ stackId: null, stackLanguage: '', stackLevel: '' }],
          awards: Array.isArray(data.awards) && data.awards.length > 0 ? data.awards : [{ awardId: null, awardType: '', awardPrize: '' }],
          certifications: Array.isArray(data.certifications) && data.certifications.length > 0 ? data.certifications : [{ certId: null, certType: '', certDate: null }],
          languageCerts: Array.isArray(data.languageCerts) && data.languageCerts.length > 0 ? data.languageCerts : [{ languageCertId: null, languageCertType: '', languageCertLevel: '', languageCertDate: null }],
        });
      }
    } catch (error) {
      console.error('데이터를 불러오는데 실패했습니다:', error);
    }
  };

  console.log("Updated data:", resumeData);

  // 페이지 이동 시 경고창 표시
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormChanged) {
        const confirmationMessage = '저장되지 않은 변경 사항이 있습니다. 정말로 페이지를 떠나시겠습니까?';
        e.preventDefault();
        e.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    const handlePopState = (e) => {
      if (isFormChanged) {
        const confirmLeave = window.confirm('저장되지 않은 변경 사항이 있습니다. 정말로 페이지를 떠나시겠습니까?');
        if (!confirmLeave) {
          // 뒤로가기를 막기 위해 현재 URL을 다시 추가합니다.
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    window.history.pushState(null, '', window.location.href);

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isFormChanged]);

   // 일반적인 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "score" || name === "total") {   // 학점(gpa) 필드 업데이트
      setResumeData((prevData) => ({
          ...prevData,
          gpas: {
              ...prevData.gpas,
              [name]: value,
          },
      }));
  } else {    // 다른 일반적인 필드 업데이트
      setResumeData({ ...resumeData, [name]: value });
  }
    setIsFormChanged(true);
  };

  // 날짜 변경 핸들러
  const handleDateChange = (section, index, dateType, date) => {
    const formattedDate = date.toISOString().split('T')[0];

    const updatedItems = [...resumeData[section]];
    updatedItems[index] = {
      ...updatedItems[index],
      [dateType]: formattedDate,
    };
    setResumeData({
      ...resumeData,
      [section]: updatedItems,
    });
    setIsFormChanged(true);
  };

  // 섹션별 아이템 변경 핸들러
  const handleItemChange = (section, index, e) => {
    const { name, value } = e.target;
    const updatedItems = resumeData[section].map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setResumeData({ ...resumeData, [section]: updatedItems });
    setIsFormChanged(true);
  };

  // 새로운 입력 필드 추가
  const addInputField = (section, newItem) => {
    setResumeData({
      ...resumeData,
      [section]: [...resumeData[section], newItem],
    });
    setIsFormChanged(true);
  };

  // 입력 필드 삭제 핸들러
  const deleteInputField = (section, index) => {
    const updatedItems = resumeData[section].filter((item, i) => i !== index);
    const deletedItem = resumeData[section][index];
    
    // id가 있는 항목만 삭제 추적
    if (deletedItem.resumeId || deletedItem.majorId || deletedItem.careerId || deletedItem.stackId || deletedItem.awardId || deletedItem.certId || deletedItem.languageCertId) {
      setDeletedItems({
        ...deletedItems,
        [section]: [...deletedItems[section], deletedItem]
      });
    }

    setResumeData({ ...resumeData, [section]: updatedItems });
    setIsFormChanged(true);
  };

  const validateForm = () => {
    const requiredSections = ['position', 'questions'];
  
    // 필수 섹션 검사
    for (const section of requiredSections) {
      if (typeof resumeData[section] === 'string' && resumeData[section].trim() === '') {
        alert(`모든 필수 항목을 입력해 주세요.`);
        return false;
      }
  
      if (Array.isArray(resumeData[section])) {
        for (const item of resumeData[section]) {
          if (!item.question || item.question.trim() === '' || !item.answer || item.answer.trim() === '') {
            alert(`모든 필수 항목을 입력해 주세요.`);
            return false;
          }
        }
      }
    }
  
  // 선택 섹션 검사
    const optionalSections = ['majors', 'careers', 'stacks', 'awards', 'certifications', 'languageCerts'];

    for (const section of optionalSections) {
      if (Array.isArray(resumeData[section])) {
        const isSectionEmpty = resumeData[section].every(item =>
          Object.values(item).every(value => value === null || (typeof value === 'string' && value.trim() === ''))
        );

        if (!isSectionEmpty) {
          for (const item of resumeData[section]) {
            // `resumeId`와 같은 불필요한 필드는 검증에서 제외
            const keysToValidate = Object.keys(item).filter(key => !key.includes('Id'));

           for (const key of keysToValidate) {
             if (item[key] === null || (typeof item[key] === 'string' && item[key].trim() === '')) {
                alert(`모든 항목을 입력해 주세요.`);
                return false;
              }
            }
          }
        }
      }
    }

    // GPA 섹션 검사
    const { score, total } = resumeData.gpas;
    if ((score && !total) || (!score && total)) {
      alert('모든 항목을 입력해 주세요.');
      return false;
    }
  
    return true;
  };

  const apiCalls = (data, endpoint) => {
    const hasId = item => item.resumeId || item.majorId || item.careerId || item.stackId || item.awardId || item.certId || item.languageCertId;
    const dataToPost = data.filter(item => !hasId(item));
    const dataToPut = data.filter(hasId);

    let promises = [];

    if (dataToPost.length > 0) {
      const dataToPostCleaned = dataToPost.map(item => {    // post시 id 제거
        const cleanedItem = { ...item };
        Object.keys(cleanedItem).forEach(key => {
          if (key.includes('Id') && cleanedItem[key] === null) {
            delete cleanedItem[key];
          }
        });
        return cleanedItem;
      });

      promises.push(
        axios.post(`https://namanba.shop/api/${endpoint}`, dataToPostCleaned, {
          headers: {
            Authorization: `Bearer ${kakaoToken}`,
          }
        })
      );
    }

    promises.push(
      ...dataToPut.map(item => 
        axios.put(`https://namanba.shop/api/${endpoint}/${hasId(item)}`, item, {
          headers: {
            Authorization: `Bearer ${kakaoToken}`,
          }
        })
      )
    );
  
    return promises;
  };

  const apiDeleteCalls = (data, endpoint) => {
    return data.map(item => {
      return axios.delete(`https://namanba.shop/api/${endpoint}/${item.resumeId || item.majorId || item.careerId || item.stackId || item.awardId || item.certId || item.languageCertId}`, {
        headers: {
          Authorization: `Bearer ${kakaoToken}`,
        }
      });
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sections = [
        'position',
        'questions',
        'majors',
        'gpas',
        'careers',
        'stacks',
        'awards',
        'certifications',
        'languageCerts'
      ];
  
      const apiEndpoints = {
        position: 'portfolio/position',
        questions: 'resumes',
        majors: 'majors',
        gpas: 'gpas',
        careers: 'careers',
        stacks: 'stacks',
        awards: 'awards',
        certifications: 'certifications',
        languageCerts: 'language-certs'
      };
  
      let allPromises = [];

      for (const section of sections) {
        const endpoint = apiEndpoints[section];
        const sectionData = Array.isArray(resumeData[section]) ? resumeData[section] : [];
        const deleteData = Array.isArray(deletedItems[section]) ? deletedItems[section] : [];

        const createOrUpdatePromises = apiCalls(sectionData, endpoint);
        const deletePromises = apiDeleteCalls(deleteData, endpoint);
        allPromises = [...allPromises, ...createOrUpdatePromises, ...deletePromises];
      }
  
      // 'position' 업데이트 처리
      allPromises.push(
        axios.put('https://namanba.shop/api/portfolio/position', null, {
          headers: {
            Authorization: `Bearer ${kakaoToken}`,
          },
          params: { positionName: resumeData.position }
        })
      );
  
      // 모든 API 요청을 병렬로 실행
      await Promise.all(allPromises);
  
      console.log('모든 요청이 성공적으로 완료되었습니다.');
      setIsFormChanged(false);
      navigate('/startInterview'); // 면접 시작 페이지로 이동
  
    } catch (error) {
      console.error('서버 요청 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <MainHeader isFormChanged={isFormChanged} />
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mb-10 mt-5 p-3">
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
          validateForm={validateForm}
          handleSubmit={handleSubmit}
        />
      </form>
    </div>
  );
}

export default InputInfo;
