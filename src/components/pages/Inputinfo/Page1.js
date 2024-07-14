import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

function PageOne({ resumeData, handleChange, handleItemChange, addInputField, deleteInputField, handleDateChange }) {
  return (
    <>
      <h2 className="mt-3 text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">직군 선택</h2>
      <div className="border-b border-gray-900/10 mt-3 mb-3"></div>
      <div className="mb-4">
        <select
          id="jobType"
          name="jobType"
          value={resumeData.jobType}
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
          <option value="hardware">하드웨어개발자QA</option>
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

      <div className="mb-3">
        <h3 className="mt-2 text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">학적</h3>
        {resumeData.major.map((major, index) => (
          <div key={index} className="mb-3">
            <div className="flex space-x-4">
              <input
                type="text"
                id={`major-${index}`}
                name="major"
                value={major}
                onChange={(e) => handleItemChange('major', index, e)}
                placeholder="전공"
                className="w-1/2 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            {index === resumeData.major.length - 1 && resumeData.major.length < 2 && (
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={() => addInputField('major', '')}
                  className="mr-3 text-sm text-blue-500 focus:outline-none"
                >
                  추가
                </button>
              </div>
            )}
            {resumeData.major.length > 1 && index === resumeData.major.length - 1 && (
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={() => deleteInputField('major', index)}
                  className="text-sm text-red-400 focus:outline-none"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        ))}

        <h3 className="mt-2 text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">학점</h3>
        {resumeData.gpa.map((gpa, index) => (
          <div key={index} className="mb-10">
            <div className="flex w-1/2 space-x-4">
              <input
                type="text"
                id={`gpa-score-${index}`}
                name="score"
                value={gpa.score}
                onChange={(e) => handleItemChange('gpa', index, e)}
                placeholder="취득 학점"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="p-3">/</p>
              <input
                type="text"
                id={`gpa-total-${index}`}
                name="total"
                value={gpa.total}
                onChange={(e) => handleItemChange('gpa', index, e)}
                placeholder="만점"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <h3 className="text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">경력 사항</h3>
        {resumeData.careers.map((career, index) => (
          <div key={index} className="mb-3">
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
          </div>
        ))}
        <div className="text-right">
          <button
            type="button"
            onClick={() => addInputField('careers', { type: '', content: '', startDate: null, endDate: null })}
            className="text-sm text-blue-500 focus:outline-none"
          >
            추가
          </button>
          {resumeData.careers.length > 1 && (
            <button
              type="button"
              onClick={() => deleteInputField('careers', resumeData.careers.length - 1)}
              className="ml-2 text-sm text-red-400 focus:outline-none"
            >
              삭제
            </button>
          )}
        </div>
      </div>

      <div className="mb-3">
        <h3 className="text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">기술 스택</h3>
        {resumeData.stacks.map((stack, index) => (
          <div key={index} className="mb-3">
            <div className="flex space-x-4">
              <input
                type="text"
                id={`language-${index}`}
                name="language"
                value={stack.language}
                onChange={(e) => handleItemChange('stacks', index, e)}
                placeholder="언어"
                className="w-3/4 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <select
                id={`level-${index}`}
                name="level"
                value={stack.level}
                onChange={(e) => handleItemChange('stacks', index, e)}
                className="w-1/4 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">수준</option>
                <option value="good">상</option>
                <option value="fair">중</option>
                <option value="poor">하</option>
              </select>
            </div>
          </div>
        ))}
        <div className="text-right">
          <button
            type="button"
            onClick={() => addInputField('stacks', { language: '', level: '' })}
            className="text-sm text-blue-500 focus:outline-none"
          >
            추가
          </button>
          {resumeData.stacks.length > 1 && (
            <button
              type="button"
              onClick={() => deleteInputField('stacks', resumeData.stacks.length - 1)}
              className="ml-2 text-sm text-red-400 focus:outline-none"
            >
              삭제
            </button>
          )}
        </div>
      </div>

      <div className="mb-3">
        <h3 className="text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">수상 내역</h3>
        {resumeData.awards.map((award, index) => (
          <div key={index} className="mb-3">
            <div className="flex space-x-4">
              <input
                type="text"
                id={`award-type-${index}`}
                name="type"
                value={award.type}
                onChange={(e) => handleItemChange('awards', index, e)}
                placeholder="대회명"
                className="w-3/4 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="text"
                id={`award-prize-${index}`}
                name="prize"
                value={award.prize}
                onChange={(e) => handleItemChange('awards', index, e)}
                placeholder="입상 내역"
                className="w-1/4 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        ))}
        <div className="text-right">
          <button
            type="button"
            onClick={() => addInputField('awards', { type: '', prize: '' })}
            className="text-sm text-blue-500 focus:outline-none"
          >
            추가
          </button>
          {resumeData.awards.length > 1 && (
            <button
              type="button"
              onClick={() => deleteInputField('awards', resumeData.awards.length - 1)}
              className="ml-2 text-sm text-red-400 focus:outline-none"
            >
              삭제
            </button>
          )}
        </div>
      </div>

      <div className="mb-3">
        <h3 className="text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">자격증</h3>
        {resumeData.certs.map((cert, index) => (
          <div key={index} className="mb-3">
            <div className="flex space-x-4">
              <input
                type="text"
                id={`cert-type-${index}`}
                name="type"
                value={cert.type}
                onChange={(e) => handleItemChange('certs', index, e)}
                placeholder="자격증명"
                className="w-1/3 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <DatePicker
                selected={cert.date}
                onChange={(date) => handleDateChange('certs', index, 'date', date)}
                locale={ko}
                dateFormat="yyyy/MM/dd"
                className="w-2/3 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholderText="취득일"
              />
            </div>
          </div>
        ))}
        <div className="text-right">
          <button
            type="button"
            onClick={() => addInputField('certs', { type: '', date: null })}
            className="text-sm text-blue-500 focus:outline-none"
          >
            추가
          </button>
          {resumeData.certs.length > 1 && (
            <button
              type="button"
              onClick={() => deleteInputField('certs', resumeData.certs.length - 1)}
              className="ml-2 text-sm text-red-400 focus:outline-none"
            >
              삭제
            </button>
          )}
        </div>
      </div>

      <div className="mb-20">
        <h3 className="text-left text-lg font-semibold leading-9 tracking-tight text-gray-900">어학 자격증</h3>
        {resumeData.languageCerts.map((languageCert, index) => (
          <div key={index} className="mb-3">
            <div className="flex space-x-4">
              <input
                type="text"
                id={`languageCert-type-${index}`}
                name="type"
                value={languageCert.type}
                onChange={(e) => handleItemChange('languageCerts', index, e)}
                placeholder="어학 자격증명"
                className="w-1/3 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="text"
                id={`languageCert-level-${index}`}
                name="level"
                value={languageCert.level}
                onChange={(e) => handleItemChange('languageCerts', index, e)}
                placeholder="성적"
                className="w-1/3 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <DatePicker
                selected={languageCert.date}
                onChange={(date) => handleDateChange('languageCerts', index, 'date', date)}
                locale={ko}
                dateFormat="yyyy/MM/dd"
                className="w-2/3 p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholderText="취득일"
              />
            </div>
          </div>
        ))}
        <div className="text-right">
          <button
            type="button"
            onClick={() => addInputField('languageCerts', { type: '', level: '', date: null })}
            className="text-sm text-blue-500 focus:outline-none"
          >
            추가
          </button>
          {resumeData.languageCerts.length > 1 && (
            <button
              type="button"
              onClick={() => deleteInputField('languageCerts', resumeData.languageCerts.length - 1)}
              className="ml-2 text-sm text-red-400 focus:outline-none"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default PageOne;
