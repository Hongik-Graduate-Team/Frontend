import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from "../../../services/AxiosClient";
import MainHeader from '../../molecules/Header/MainHeader';
import PageOne from './Page1';
import PageTwo from './Page2';
import NavigationButtons from './NavButton';

function InputInfo() {
  const [page, setPage] = useState(1);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeData, setResumeData] = useState({
    position: '',
    questions: [{ resumeId: null, question: '', answer: '' }],
    majors: [{ majorId: null, majorName: '' }] ,
    gpas: [{ gpaId: null, score: '', total: '' }],
    careers: [{ careerId: null, careerType: '', content: '', startDate: null, endDate: null }],
    stacks: [{ stackId: null, stackLanguage: '', stackLevel: '' }],
    awards: [{ awardId: null, awardType: '', awardPrize: '' }],
    certifications: [{ certId: null, certType: '', certDate: null }],
    languageCerts: [{ languageCertId: null, languageCertType: '', languageCertLevel: '', languageCertDate: null }]
  });

  const [deletedItems, setDeletedItems] = useState({
    questions: [],
    majors: [],
    gpas: [],
    careers: [],
    stacks: [],
    awards: [],
    certifications: [],
    languageCerts: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    // 서버에서 데이터 불러오기
    const loadData = async () => {
      try {
        const response = await axiosClient.get(`/api/portfolio`);

        const data = response.data.data || {};
        console.log("fetched data:", data);

        // 서버에서 받은 데이터를 상태에 저장
        setResumeData({
          position: data.positionName || '',
          questions: data.resumes.length > 0 ? data.resumes : [{ resumeId: null, question: '', answer: '' }],
          majors: data.majors.length > 0 ? data.majors : [{ majorId: null, majorName: '' }],
          gpas: data.gpas.length > 0 ? data.gpas : [{ gpaId: null, score: '', total: '' }],
          careers: data.careers.length > 0 ? data.careers : [{ careerId: null, careerType: '', content: '', startDate: null, endDate: null }],
          stacks: data.stacks.length > 0 ? data.stacks : [{ stackId: null, stackLanguage: '', stackLevel: '' }],
          awards: data.awards.length > 0 ? data.awards : [{ awardId: null, awardType: '', awardPrize: '' }],
          certifications: data.certifications.length > 0 ? data.certifications : [{ certId: null, certType: '', certDate: null }],
          languageCerts: data.languageCerts.length > 0 ? data.languageCerts : [{ languageCertId: null, languageCertType: '', languageCertLevel: '', languageCertDate: null }],
        });
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // 403 오류를 데이터 부재로 간주하여 기본값 처리
          return {};
        } else {
          // 다른 오류 처리
          console.error("데이터를 불러오는 중 오류 발생:", error);
          alert('데이터를 불러오는 중 오류가 발생했습니다.');
        }
      }
    };

    // 데이터 로딩 실행
    loadData();
  }, [navigate]); // `navigate`를 종속성으로 추가하여 안전하게 리디렉션 처리

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
          // 뒤로가기를 막기 위해 현재 URL을 다시 추가
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
const handleChange = (e, index) => {
  const { name, value } = e.target;
  setResumeData({ ...resumeData, [name]: value });
  setIsFormChanged(true);
};

  // 날짜 변경 핸들러
  const handleDateChange = (section, index, dateType, date) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : null;

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
    
    // ID가 있는 항목만 삭제 추적
    const idKey = Object.keys(deletedItem).find(key => key.includes('Id'));
    if (idKey && deletedItem[idKey] !== null) {
        setDeletedItems(prevState => ({
            ...prevState,
            [section]: [...prevState[section], deletedItem]
        }));
    }

    setResumeData(prevData => ({
        ...prevData,
        [section]: updatedItems
    }));
    setIsFormChanged(true);
  };

  // 폼 유효성 검사
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

  // 선택 섹션 검사 (Optional Sections Check)
  const optionalSections = ['majors', 'careers', 'stacks', 'awards', 'certifications', 'languageCerts'];

  for (const section of optionalSections) {
    if (Array.isArray(resumeData[section])) {
      // 선택 섹션이 비어있는지 검사
      const isSectionEmpty = resumeData[section].every(item =>
        Object.keys(item).filter(key => !key.includes('Id')).every(key => 
          item[key] === null || item[key] === '' || item[key] === undefined
        )
      );

      // 섹션이 완전히 비어 있다면 검증을 건너뜀
      if (isSectionEmpty) {
        continue; // 다음 섹션으로 넘어감
      }

      // 섹션이 비어 있지 않으면 검증
      for (const item of resumeData[section]) {
        const keysToValidate = Object.keys(item).filter(key => !key.includes('Id')); // 'Id' 필드는 제외
        for (const key of keysToValidate) {
          if (item[key] === null || (typeof item[key] === 'string' && item[key].trim() === '')) {
            alert(`모든 항목을 입력해 주세요.`);
            return false;
          }
        }
      }
    }
  }
    // GPA 섹션 검사
    if (resumeData.gpas) {
      const { score, total } = resumeData.gpas[0];
      if ((score && !total) || (!score && total)) {
        alert('모든 항목을 입력해 주세요.');
        return false;
      }
    }
  
    return true;
  };

  const findIdField = (item) => {
    return Object.keys(item).find(key => key.includes('Id'));
  };
  
  const removeIdField = (item) => {
    const idField = findIdField(item);
    if (idField) {
      const { [idField]: _, ...rest } = item;
      return rest;
    }
    return item;
  };
  
  const apiCalls = (data, endpoint) => {
    const hasId = item => {
      const idField = findIdField(item);
      return idField && item[idField];
    };

    // 빈 데이터 필터링
    const isNotEmpty = item => {
      return Object.keys(item).filter(key => !key.includes('Id')).some(key => {
        const value = item[key];
        return value !== null && value !== '' && value !== undefined;
      });
    };

    // Separate data into items for POST and PUT requests
    const dataToPost = data.filter(item => !hasId(item) && isNotEmpty(item)).map(removeIdField); // Remove ID fields from items to be posted
    const dataToPut = data.filter(item => hasId(item) && isNotEmpty(item));


    let promises = [];
  
    if (dataToPost.length > 0) {
      promises.push(
        axiosClient.post(`/api/${endpoint}`, dataToPost
        ).catch(error => {
          console.error(`POST ${endpoint} 요청 오류:`, error);
        })
      );
    }
  
    if (dataToPut.length > 0) {
      promises.push(
        axiosClient.put(`/api/${endpoint}`, dataToPut
        ).catch(error => {
          console.error(`PUT ${endpoint} 요청 오류:`, error);
        })
      );
    }
  
    return promises;
  };
  
  const apiDeleteCalls = (data, endpoint) => {
    const idsToDelete = data.map(item => {
      const idField = findIdField(item);
      return idField ? item[idField] : null;
    }).filter(id => id !== null && id !== undefined);
  
    if (idsToDelete.length > 0) {
      return [
        axiosClient.delete(`/api/${endpoint}`, {
          data: idsToDelete
        }).catch(error => {
          console.error(`DELETE ${endpoint} 요청 오류:`, error);
        })
      ];
    }
    return [];
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // 중복 호출 방지
    setIsSubmitting(true);
    try {
      const sections = [
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
      let hasError = false; // 오류 발생 여부
  
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
        axiosClient.put(`/api/portfolio/position`, null, {
          params: { positionName: resumeData.position }
        }).catch(error => {
          console.error('PUT position 요청 오류:', error);
          alert('저장 중 오류가 발생했습니다.');
          hasError = true;
        })
      );

      // 모든 요청을 병렬로 실행
      await Promise.all(allPromises).catch(error => {
        console.error('요청 중 오류:', error);
        alert('저장 중 오류가 발생했습니다.');
        hasError = true;
      });

      if (hasError) {
        return false; // 오류가 발생한 경우 false 반환
      }

    } catch (error) {
      console.error('서버 요청 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
      return false; // 오류 발생 시 false 반환
    } finally {
      setIsFormChanged(false);
      setIsSubmitting(false); // 실행 후 상태 리셋;
      return true; // 성공적으로 저장된 경우 true 반환
  }
  };

  return (
    <div>
      <MainHeader isFormChanged={isFormChanged} />
      <form className="max-w-4xl mx-auto mb-10 mt-5 p-3">
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
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
}

export default InputInfo;