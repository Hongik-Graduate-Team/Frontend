import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import deleteIcon from '../../../assets/img/delete.png'
import addIcon from '../../../assets/img/add.png' 

function PageOne({ resumeData, handleChange, handleItemChange, addInputField, deleteInputField, handleDateChange }) {
  return (
    <>
      <h2 className="mt-3 text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">직군 선택
        <span className='text-red-400'> *</span>
      </h2>
      <div className="border-b border-gray-900/10 mt-3 mb-3"></div>
      <div className="mb-4">
        <select
          id="position"
          name="position"
          value={resumeData.position}
          onChange={handleChange}
          className="w-1/3 p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        >
          <option value="">직군을 선택하세요</option>
          <option value="backend">백엔드 개발자</option>
          <option value="frontend">프론트엔드 개발자</option>
          <option value="web">웹개발자</option>
          <option value="web-publisher">웹 퍼블리셔</option>
          <option value="app">앱개발자</option>
          <option value="game">게임개발자</option>
          <option value="software">소프트웨어개발자</option>
          <option value="hardware">하드웨어개발자</option>
          <option value="qa">QA</option>
          <option value="system-engineer">시스템엔지니어</option>
          <option value="network-engineer">네트워크엔지니어</option>
          <option value="security-engineer">보안엔지니어</option>
          <option value="cloud-engineer">클라우드엔지니어</option>
          <option value="it-consulting">IT 컨설팅</option>
          <option value="dba">DBA</option>
          <option value="data-engineer">데이터엔지니어</option>
          <option value="data-scientist">데이터사이언티스트</option>
          <option value="ml-engineer">머신러닝엔지니어</option>
          <option value="blockchain">블록체인 개발자</option>
        </select>
      </div>

      <h2 className="mt-10 text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">포트폴리오 입력</h2>
      <div className="border-b border-gray-900/10 mt-3 mb-3"></div>

      <div className="mb-10">
        <h3 className="mt-2 text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">학적</h3>
        {resumeData.majors.map((major, index) => (
          <div key={index} className="mb-3 flex space-x-4">
            <input
              id={`major-${index}`}
              name="majorName"
              value={major.majorName}
              onChange={(e) => handleItemChange('majors', index, e)}
              placeholder="전공"
              className="w-1/2 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="ml-4 mt-4">
              {resumeData.majors.length < 2 && index === resumeData.majors.length - 1 && (
                <button
                  type="button"
                  onClick={() => addInputField('majors', {majorId:null, majorName:''})}
                >
                  <img src={addIcon} alt="추가 아이콘" className='w-5'/>
                </button>
              )}
              {resumeData.majors.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteInputField('majors', index)}
                >
                  <img src={deleteIcon} alt="삭제 아이콘" className='w-5'/>
                </button>              
              )}
            </div>
          </div>
        ))}
      </div>
      
      <h3 className="mt-2 text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">학점</h3>
          <div className="mb-10">
            <div className="flex w-1/2 space-x-4">
              <input
                type="number"
                id="score"
                name="score"
                value={resumeData.gpas.score}
                onChange={handleChange}
                placeholder="취득 학점"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="p-3 mt-1">/</p>
              <input
                type="number"
                id="total"
                name="total"
                value={resumeData.gpas.total}
                onChange={handleChange}
                placeholder="만점"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

      <div className="mb-10">
        <div className="flex justify-between items-center">
          <h3 className="text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">경력 사항</h3>
          <button
            type="button"
            onClick={() => addInputField('careers', { careerId: null ,careerType: '', content: '', startDate: null, endDate: null })}
          >
            <img src={addIcon} alt="추가 아이콘" className='mt-2 w-5'/>
          </button>
        </div>
        {resumeData.careers && resumeData.careers.map((career, index) => (
          <div key={index} className="mb-3 flex items-center">
            <div className="flex w-5/6 space-x-4">
              <select
                id={`careerType-${index}`}
                name="careerType"
                value={career.careerType}
                onChange={(e) => handleItemChange('careers', index, e)}
                className="w-1/4 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                onChange={(e) => handleItemChange('careers', index, e)}
                placeholder="내용"
                className="w-3/4 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <DatePicker
                selected={career.startDate}
                onChange={(date) => handleDateChange('careers', index, 'startDate', date)}
                selectsStart
                startDate={career.startDate}
                endDate={career.endDate}
                locale={ko}
                dateFormat="yyyy/MM/dd"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholderText="시작일"
              />
              <DatePicker
                selected={career.endDate}
                onChange={(date) => handleDateChange('careers', index, 'endDate', date)}
                selectsEnd
                startDate={career.startDate}
                endDate={career.endDate}
                minDate={career.startDate}
                locale={ko}
                dateFormat="yyyy/MM/dd"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholderText="종료일"
              />
              </div>  
              {resumeData.careers.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteInputField('careers', index)}
                >
                  <img src={deleteIcon} alt="삭제 아이콘" className='mt-1 ml-4 w-5'/>
                </button>
              )}
          </div>
        ))}
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center">
          <h3 className="text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">기술 스택</h3>
          <button
            type="button"
            onClick={() => addInputField('stacks', { stackId: null,stackLanguage: '', stackLevel: '' })}
          >
            <img src={addIcon} alt="추가 아이콘" className='mt-2 w-5'/>
          </button>
        </div>
          {resumeData.stacks && resumeData.stacks.map((stack, index) => (
            <div key={index} className="mb-3 flex items-center">
              <div className="flex w-2/3 space-x-4">
                <input
                  type="text"
                  id={`stackLanguage-${index}`}
                  name="stackLanguage"
                  value={stack.stackLanguage}
                  onChange={(e) => handleItemChange('stacks', index, e)}
                  placeholder="언어"
                  className="w-3/4 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <select
                  id={`stackLevel-${index}`}
                  name="stackLevel"
                  value={stack.stackLevel}
                  onChange={(e) => handleItemChange('stacks', index, e)}
                  className="w-1/4 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">수준</option>
                  <option value="good">상</option>
                  <option value="fair">중</option>
                  <option value="poor">하</option>
                </select>
              </div>
                {resumeData.stacks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteInputField('stacks', index)}
                    className="text-sm text-red-400 focus:outline-none"
                  >
                    <img src={deleteIcon} alt="삭제 아이콘" className='mt-1 ml-4 w-5'/>
                  </button>
                )}
            </div>
          ))}
        </div>

        <div className="mb-10">
          <div className="flex justify-between items-center">
            <h3 className="text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">수상 내역</h3>
            <button
              type="button"
              onClick={() => addInputField('awards', { awardId: null,awardType: '', awardPrize: '' })}
            >
              <img src={addIcon} alt="추가 아이콘" className='mt-2 w-5'/>
            </button>
          </div>
          {resumeData.awards && resumeData.awards.map((award, index) => (
            <div key={index} className="mb-3 flex items-center">
              <div className="flex w-2/3 space-x-4">
                <input
                  type="text"
                  id={`awardType-${index}`}
                  name="awardType"
                  value={award.awardType}
                  onChange={(e) => handleItemChange('awards', index, e)}
                  placeholder="대회명"
                  className="w-3/4 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                <input
                  type="text"
                  id={`awardPrize-${index}`}
                  name="awardPrize"
                  value={award.awardPrize}
                  onChange={(e) => handleItemChange('awards', index, e)}
                  placeholder="입상 내역"
                  className="w-1/4 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              {resumeData.awards.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteInputField('awards', index)}
                  >
                  <img src={deleteIcon} alt="삭제 아이콘" className='mt-1 ml-4 w-5'/>
                </button>
              )}
            </div>
          ))}
        </div>


      <div className="mb-10">
        <div className="flex justify-between items-center">
          <h3 className="text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">자격증</h3>
          <button
            type="button"
            onClick={() => addInputField('certifications', { certId: null, certType: '', certDate: null })}
          >
            <img src={addIcon} alt="추가 아이콘" className='mt-2 w-5'/>
          </button>
        </div>
        {resumeData.certifications && resumeData.certifications.map((certification, index) => (
          <div key={index} className="mb-3 flex items-center">
            <div className="flex w-2/3 space-x-4">
              <input
                type="text"
                id={`certType-${index}`}
                name="certType"
                value={certification.certType}
                onChange={(e) => handleItemChange('certifications', index, e)}
                placeholder="자격증명"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <DatePicker
                selected={certification.certDate}
                onChange={(date) => handleDateChange('certifications', index, 'certDate', date)}
                locale={ko}
                dateFormat="yyyy/MM/dd"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholderText="취득일"
              />
            </div>
            {resumeData.certifications.length > 1 && (
              <button
                type="button"
                onClick={() => deleteInputField('certifications', index)}
              >
                <img src={deleteIcon} alt="삭제 아이콘" className='mt-1 ml-4 w-5'/>
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mb-20">
        <div className="flex justify-between items-center">
          <h3 className="text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">어학 자격증</h3>
          <button
            type="button"
            onClick={() => addInputField('languageCerts', { languageCertId: null, languageCertType: '', languageCertLevel: '', languageCertDate: null })}
          >
            <img src={addIcon} alt="추가 아이콘" className='mt-2 w-5'/>
          </button>
        </div>
        {resumeData.languageCerts && resumeData.languageCerts.map((languageCert, index) => (
          <div key={index} className="mb-3 flex items-center">
            <div className="flex w-2/3 space-x-4">
              <input
                type="text"
                id={`languageCertType-${index}`}
                name="languageCertType"
                value={languageCert.languageCertType}
                onChange={(e) => handleItemChange('languageCerts', index, e)}
                placeholder="어학 자격증명"
                className="w-1/2 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="text"
                id={`languageCertLevel-${index}`}
                name="languageCertLevel"
                value={languageCert.languageCertLevel}
                onChange={(e) => handleItemChange('languageCerts', index, e)}
                placeholder="성적"
                className="w-1/2 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <DatePicker
                selected={languageCert.languageCertDate}
                onChange={(date) => handleDateChange('languageCerts', index, 'languageCertDate', date)}
                locale={ko}
                dateFormat="yyyy/MM/dd"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholderText="취득일"
              />
            </div>
            {resumeData.languageCerts && resumeData.languageCerts.length > 1 && (
              <button
                type="button"
                onClick={() => deleteInputField('languageCerts', index)}
              >
                <img src={deleteIcon} alt="삭제 아이콘" className='mt-1 ml-4 w-5'/>
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default PageOne;
