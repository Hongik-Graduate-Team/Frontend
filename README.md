# 👩‍💼 사용자 맞춤 면접 시뮬레이션 서비스	
![optimized_image_2](https://github.com/user-attachments/assets/413124cc-164e-4b46-9a43-5c669ada466a)


> **사용자의 면접 준비부터 피드백까지 전 과정을 지원하는 개인 맞춤형 AI 면접 시뮬레이션 서비스입니다. <br/>
> 지원 직군을 선택하고 포트폴리오와 자기소개서를 입력하면, 이를 바탕으로 맞춤형 면접 질문이 생성됩니다.<br/> 
생성된 질문을 활용해 면접 시뮬레이션을 진행하면, AI가 영상을 분석하여 시선, 제스처, 표정 등 비언어적 요소에 대한 상세한 피드백을 제공합니다.**

<br>

## 🌐 배포 URL  
🔗 **[나만바 바로가기](https://namanba.site/)**  

<br>

## 🛠 서비스 사용법  

![optimized_image](https://github.com/user-attachments/assets/9319c130-1f6e-4e4a-b7ec-191e1fe2ac96)

<br>

## 👥 팀원 소개  

<div align="center">

<table>
  <tr>
    <td><img src="https://avatars.githubusercontent.com/u/81088222?v=4" width="200"></td>
    <td><img src="https://avatars.githubusercontent.com/u/81136546?v=4" width="200"></td>
    <td><img src="https://avatars.githubusercontent.com/u/90558692?v=4" width="200"></td>
    <td><img src="https://avatars.githubusercontent.com/u/103306888?v=4" width="200"></td>
  </tr>
  <tr>
    <td><p align="center"><b>서혜원</b></p></td>
    <td><p align="center"><b>조예지</b></p></td>
    <td><p align="center"><b>장윤서</b></p></td>
    <td><p align="center"><b>박선하</b></p></td>
  </tr>
  <tr>
    <td><p align="center">프로젝트 팀장 & 백엔드</p></td>
    <td><p align="center">백엔드</p></td>
    <td><p align="center">프론트엔드 & 디자인</p></td>
    <td><p align="center">프론트엔드 & 디자인</p></td>
  </tr>
  <tr>
    <td><p align="center"><a href="https://github.com/JSHWJ">@JSHWJ</a></p></td>
    <td><p align="center"><a href="https://github.com/CYJhub">@CYJhub</a></p></td>
    <td><p align="center"><a href="https://github.com/Ooorami">@Ooorami</a></p></td>
    <td><p align="center"><a href="https://github.com/ahnus">@ahnus</a></p></td>
  </tr>
</table>

</div>


## 팀원별 역할  

### 🏆 서혜원 - 프로젝트 팀장 & 백엔드 개발  

#### **📌 프로젝트 팀장 역할**  
- 프로젝트 일정 조율  
- 회의록 관리 및 문서 정리  
- 프로젝트 진행에 필요한 문서 및 자료 정리  

#### **⚙️ 백엔드 개발 역할**  
- **개발 기획**  
  - 사용자 포트폴리오 및 맞춤형 질문 개발 기획  
  - 사용자 면접 데이터 평가 시스템 설계  
- **DB 설계**  
  - 사용자 포트폴리오 및 기본 질문 DB 설계  
  - 사용자 맞춤형 질문 DB 설계  
  - 사용자 데이터 기반 평가 DB 설계  
- **API 개발**  
  - **사용자 포트폴리오 관리**  
    - 포트폴리오 각 카테고리별(수상 이력, 성적, 자기소개서, 어학 자격증 등) CRUD 기능 구현  
  - **마이페이지 기능**  
    - 사용자 인터뷰 목록 조회 API  
    - 사용자 인터뷰 상세 조회 API  
  - **평가 및 AI 활용 기능**  
    - 사용자 시선 및 자세 평가 API  
    - 생성형 AI 기반 사용자 정보 맞춤형 질문 생성 및 반환 API  
  - **사용자 데이터 관리**  
    - 사용자 정보 조회 API  

##

### 🔧 조예지 - 백엔드 개발  
⚙️ **백엔드 개발 역할**  
- **설계 및 인프라 구축**  
  - API 설계 및 DB(RDS) 생성
  - Docker 컨테이너 생성 및 Nginx 구축
  - 서버 구축 및 배포 환경 설정
  - CI/CD 자동화 (GitHub Actions 활용)   
- **API 개발**  
  - **회원 관리 기능**  
    - 카카오 로그인 구현
    - 로그인 연장 및 로그아웃 처리
  - **면접 평가 기능**  
    - 표정 평가 및 피드백 반환 API 
    - 침묵 비율 검출 및 피드백 반환 API
    - 목소리 크기 측정 및 피드백 반환 API

##

### 🎨 장윤서 - 프론트엔드 개발 & 디자인  

#### **📌 프론트엔드 개발 역할**  
- **카카오 로그인 기능 개발**  
  - 카카오 회원가입 및 로그인 구현   
- **재사용 가능한 모달창 개발 및 디자인**  
  - UI/UX 디자인 개선  
- **마이페이지 개발 및 디자인**  
  - 사용자 인터뷰 목록 조회 페이지 개발 및 디자인  
  - 사용자 인터뷰 상세 조회 페이지 개발 및 디자인  
- **면접 준비, 진행 페이지 및 메인 페이지 공동 개발**  
  - 디자인 및 기능 구현  
  - 사용자 인터페이스 최적화    
- **AI 기반 표정 분석 개발**  
  - face-api.js를 활용하여 사용자의 표정 인식 기능 개발  
  - 표정 데이터 분석 및 시각적 피드백 제공  

##

### 🎨 박선하 - 프론트엔드 개발 & 디자인  

#### **📌 프론트엔드 개발 역할**  
- **자기소개서 입력 페이지 개발**  
  - 포트폴리오 및 자기소개서 입력 기능 구현  
- **피드백 페이지 개발**  
  - 피드백 데이터 시각화 개발 및 디자인  
  - 면접 영상 저장 기능 구현  
- **면접 준비, 진행 페이지 및 메인 페이지 공동 개발**  
  - 디자인 및 기능 구현  
  - 사용자 인터페이스 최적화  
- **AI 기반 제스처, 시선 분석 개발**  
  - Mediapipe API를 활용하여 사용자의 시선 움직임 및 자세 분석  


---

## 🛠 기술 스택 및 개발 환경  

###  **Frontend**  

![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=white)

##

###  **Backend**  

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)

##

###  **AI 분석 기술**  

![MediaPipe](https://img.shields.io/badge/MediaPipe-4285F4?style=flat&logo=google&logoColor=white)
![Face-API.js](https://img.shields.io/badge/Face--API.js-FF6F00?style=flat&logo=javascript&logoColor=white)

##

###  **DevOps & 배포 환경**  

![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazon-aws&logoColor=white)

##

###  **개발 협업 툴**  

![Notion](https://img.shields.io/badge/Notion-000000?style=flat&logo=notion&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=flat&logo=figma&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)
![Slack](https://img.shields.io/badge/Slack-4A154B?style=flat&logo=slack&logoColor=white)

---

## 📅 개발 일정  

<div align="center">

<table>
  <tr>
    <th style="font-size: 18px; padding: 15px;"> 단계</th>
    <th style="font-size: 18px; padding: 15px;"> 기간</th>
    <th style="font-size: 18px; padding: 15px;"> 내용</th>
  </tr>
  <tr>
    <td style="font-size: 16px; padding: 12px;"><b>설계 기간</b></td>
    <td style="font-size: 16px; padding: 12px;">2024.03.01 ~ 2024.06.30</td>
    <td style="font-size: 16px; padding: 12px;">시스템 아키텍처 및 UI/UX 설계</td>
  </tr>
  <tr>
    <td style="font-size: 16px; padding: 12px;"><b>개발 기간</b></td>
    <td style="font-size: 16px; padding: 12px;">2024.07.01 ~ 2024.09.15</td>
    <td style="font-size: 16px; padding: 12px;">핵심 기능 구현 및 시스템 개발</td>
  </tr>
  <tr>
    <td style="font-size: 16px; padding: 12px;"><b>유지보수 기간</b></td>
    <td style="font-size: 16px; padding: 12px;">2024.09.16 ~ 2024.11.30</td>
    <td style="font-size: 16px; padding: 12px;">성능 개선 및 최적화, 버그 수정</td>
  </tr>
  <tr>
    <td style="font-size: 18px; padding: 15px;"><b>총 개발 기간</b></td>
    <td style="font-size: 18px; padding: 15px;">2024.03.01 ~ 2024.11.30</td>
    <td style="font-size: 18px; padding: 15px;">전체 프로젝트 진행 기간</td>
  </tr>
</table>

</div>


## 🌟 나만바 서비스 기능 소개

### 🏠 메인페이지  
서비스 주요 기능 소개와 빠른 이동이 가능한 랜딩 페이지입니다.  
사용자는 포트폴리오/자기소개서 작성, 면접 준비, 결과 확인 등의 기능을 쉽게 확인할 수 있습니다.


| 메인페이지 |
|---------|
|<img src="https://github.com/user-attachments/assets/715e8997-476e-4779-bdfc-7e52b73a66c5" width="700"/>|


---

### 👤 마이페이지  
사용자가 업로드한 포트폴리오/자소서 목록과 이전 면접 기록을 확인할 수 있는 개인화된 공간입니다.

| 마이페이지 |
|---------|
|<img src="https://github.com/user-attachments/assets/00db35f4-e5bc-4333-9375-16ad135421ce" width="700"/>|


---

### 📊 결과 피드백 
AI가 사용자의 면접 내용을 분석하여 음성, 시선, 제스처 등 다양한 항목에 대한 피드백을 제공합니다.

| 결과 피드백 |
|---------|
|<img src="https://github.com/user-attachments/assets/606a5936-3489-4198-bb1b-b377403ed856" width="700"/>|

---

### 🔐 로그인
카카오 소셜 로그인 기능을 통해 간편하게 로그인할 수 있습니다. 

| 로그인 |
|------|
|<img src="https://github.com/user-attachments/assets/0a252024-3b30-4bc0-8fdb-a9475f45da0c" width="700"/>|

---

### 📝 포트폴리오 작성
사용자는 자신의 포트폴리오를 등록하고 관리할 수 있으며, 면접 질문 생성을 위한 기초 자료로 활용됩니다.

| 포트폴리오 작성 |
|-------------|
|<img src="https://github.com/user-attachments/assets/75627292-6199-4f20-8dea-02113eeec703" width="700"/>|



---

### ✍️ 자기소개서 작성
자기소개서를 항목별로 작성 및 등록할 수 있으며, AI 면접 질문 생성을 위한 핵심 데이터로 활용됩니다.

| 자기소개서 작성|
|------------|
|<img src="https://github.com/user-attachments/assets/7059fe97-c900-4d88-afda-ae3271705b3f" width="700"/>|

---

### 면접 준비 페이지 (화면·음성 체크)

실제 면접 전 카메라 및 마이크 사전 점검 기능 제공
사용자의 자세, 조명, 배경음 등을 확인할 수 있도록 가이드 제공
원활한 AI 면접 환경을 위한 체크리스트 제공

|면접 준비|
|-------|
|<img src="https://github.com/user-attachments/assets/4e48791e-57af-48c7-9a92-01d6f34ecf93" width="700"/>|



### 면접 페이지

실제 면접 시뮬레이션 기능 제공
자소서를 기반으로 AI가 면접 질문을 자동 생성 및 제시
사용자는 음성으로 답변하며, 카메라를 통해 표정·시선·제스처도 함께 기록

| 면접 진행 |
|-------|
|<img src="https://github.com/user-attachments/assets/0da4475e-672f-4dd0-992f-dad494c84ca6" width="700"/>|
