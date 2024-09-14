import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import MainHeader from '../../molecules/Header/MainHeader';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const InterviewStartPage = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const isInterviewStarted = useState(true);
    const [remainingTime, setRemainingTime] = useState(30);  // 시간 설정
    const [currentStep, setCurrentStep] = useState('announcement');  // 현재 단계 (announcement, ready, answering)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);  // 현재 질문 번호
    const [answerTime, setAnswerTime] = useState(120);  // 답변 시간 (2분)
    const totalQuestions = 5;  // 총 질문 개수

    // 다음 단계로 이동하는 함수 (다음 질문 또는 면접 종료)
    const moveToNextStep = useCallback(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setCurrentStep('ready');  // 다음 질문 전 준비 시간 시작
            setRemainingTime(30);  // 준비 시간 30초 재설정
        } else {
            alert("모든 질문이 완료되었습니다. 면접을 종료합니다.");
            navigate('/feedback');  // 면접 종료 페이지로 이동
        }
    }, [currentQuestionIndex, totalQuestions, navigate]);

    // 음성 재생 기능 추가 (안내 문구 재생)
    useEffect(() => {
        if (currentStep === 'announcement') {
            const speech = new SpeechSynthesisUtterance();
            speech.text = "지금부터 면접을 시작하겠습니다. 준비시간이 끝나면 자동으로 녹화가 시작됩니다.";
            speech.lang = "ko-KR";
            window.speechSynthesis.speak(speech);
        }
    }, [currentStep]);

    // 단계 전환 로직
    useEffect(() => {
        if (remainingTime > 0 && (currentStep === 'announcement' || currentStep === 'ready')) {
            const timer = setTimeout(() => setRemainingTime(remainingTime - 1), 1000);
            return () => clearTimeout(timer);
        } else if (remainingTime === 0) {
            if (currentStep === 'announcement') {
                setCurrentStep('ready');  // 안내사항이 끝나면 준비 시간으로 이동
                setRemainingTime(30);     // 준비 시간 30초 설정
            } else if (currentStep === 'ready') {
                setCurrentStep('answering');  // 준비 시간이 끝나면 질문 답변 시간으로 이동
                setAnswerTime(120);  // 답변 시간 120초로 설정
                startRecording();  // 녹화 시작
            }
        }
    }, [remainingTime, currentStep]);

    // 답변 시간 카운트다운
    useEffect(() => {
        if (currentStep === 'answering' && answerTime > 0) {
            const timer = setTimeout(() => {
                setAnswerTime((prevTime) => prevTime - 1);
            }, 1000);
    
            // Cleanup 함수: 타이머를 정리합니다.
            return () => clearTimeout(timer);
        } else if (answerTime === 0) {
            stopRecording();  // 녹화 중지
            moveToNextStep();  // 다음 단계로 이동
        }
    }, [currentStep, answerTime, moveToNextStep]);

    // 페이지 이동 시 경고창 표시
    useEffect(() => {
      const handleBeforeUnload = (e) => {
        if (isInterviewStarted) {
          const confirmationMessage = '저장되지 않은 변경 사항이 있습니다. 정말로 페이지를 떠나시겠습니까?';
          e.preventDefault();
          e.returnValue = confirmationMessage;
          return confirmationMessage;
        }
      };
         const handlePopState = (e) => {
        if (isInterviewStarted) {
          const confirmLeave = window.confirm('면접이 끝나지 않았습니다. 정말로 페이지를 떠나시겠습니까?');
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
    }, [isInterviewStarted]);

    // Face-api를 이용해 얼굴을 인식하고 비디오 출력
    useEffect(() => {
        const videoElement = videoRef.current;

        const setupMediaDevices = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                if (videoElement) {
                    videoElement.srcObject = stream;
                    videoElement.onloadedmetadata = () => {
                        videoElement.play().catch(error => console.error('Video play error:', error));
                        loadFaceApiModel();
                    };
                }
            } catch (error) {
                console.error('Error accessing media devices.', error);
                alert('카메라 권한이 필요합니다.');
            }
        };

        const loadFaceApiModel = async () => {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            detectFace();
        };

        const detectFace = async () => {
            const detect = async () => {
                if (videoElement && videoElement.readyState >= 2) {
                    await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions());
                }
                requestAnimationFrame(detect);
            };

            detect();
        };

        setupMediaDevices();

        return () => {
            if (videoElement && videoElement.srcObject) {
                const stream = videoElement.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                videoElement.srcObject = null;
            }
        };
    }, [videoRef]);

    // 녹화 시작
    const startRecording = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.start();
        }
    };

    // 녹화 중지
    const stopRecording = () => {
        const mediaRecorder = mediaRecorderRef.current;
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.ondataavailable = (event) => {
                const blob = new Blob([event.data], { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                // 비디오를 서버에 업로드하거나 처리하는 로직을 추가합니다.
                console.log('녹화된 비디오 URL:', url);
            };
        }
    };

    const GradientSVG = () => (
        <svg style={{ height: 0 }}>
            <defs>
                <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D9AFD9" /> {/* 시작 색상 */}
                    <stop offset="100%" stopColor="#97D9E1" /> {/* 끝 색상 */}
                </linearGradient>

                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#80D0C7" /> {/* 시작 색상 */}
                    <stop offset="100%" stopColor="#0093E9" /> {/* 끝 색상 */}
                </linearGradient>

                <linearGradient id="redGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5D67FF" /> {/* 시작 색상 */}
                    <stop offset="100%" stopColor="#FF3C3C" /> {/* 끝 색상 */}
                </linearGradient>
            </defs>
        </svg>
    );

    return (
        <div className="relative flex flex-col items-center justify-start min-h-screen">
    <MainHeader isInterviewStarted={isInterviewStarted}/>

    {/* 상태에 따른 안내 및 질문 내용 - 헤더 바로 밑 */}
    <div className="w-full mt-2 text-center">
        {currentStep === 'announcement' && (
            <div>
                <p className="text-3xl font-semibold mb-4">지금부터 면접을 시작하겠습니다.</p>
                <p className="text-2xl mb-5">준비시간이 끝나면 자동으로 녹화가 시작됩니다.</p>
            </div>
        )}

        {currentStep === 'ready' && (
            <div>
                <button
                    className="px-3 py-1 text-teal-400 text-xl font-semibold bg-teal-50 rounded-md mb-4"
                >
                    질문 {currentQuestionIndex + 1} / {totalQuestions}
                </button><br />
                <p className="text-3xl font-semibold mb-4">여기 질문 내용이 들어갑니다.</p>
            </div>
        )}

        {currentStep === 'answering' && (
            <div>
                <button
                    className="px-3 py-1 text-teal-400 text-xl font-semibold bg-teal-50 rounded-md mb-4"
                >
                    질문 {currentQuestionIndex + 1} / {totalQuestions}
                </button><br />
                <p className="text-3xl font-semibold mb-4">질문 내용내용</p>
            </div>
        )}
    </div>

    {/* 화면과 오른쪽 정보 및 버튼 */}
    <div className="flex w-full max-w-7xl mt-4">
        {/* 비디오 화면 - 왼쪽 */}
        <div className="flex-grow-[1]">
            <video ref={videoRef} className="rounded-lg shadow-xl w-full" />
        </div>

        {/* 시간 및 버튼 - 오른쪽 */}
        <div className="flex-grow-[1] basis-1/4 flex flex-col items-center justify-center p-3 rounded-lg">
            <GradientSVG />
            {currentStep === 'announcement' && (
                <div className='text-center'>
                    <CircularProgressbar
                        value={(remainingTime / 30) * 100}
                        text={
                             <tspan>
                                <tspan x="50%" dy="-3em" fontSize="0.45rem" fill="#97D9E1">준비 시간</tspan> 
                                <tspan x="50%" dy="1em" fontSize="1.5rem" fontWeight="bold" textAnchor="middle">{`0${Math.floor(remainingTime / 60)}:${("0" + (remainingTime % 60)).slice(-2)}`}</tspan>
                            </tspan>
                        }
                        styles={buildStyles({
                            pathColor: 'url(#greenGradient)', // 프로그레스 바 색상
                            textColor: '#97D9E1', // 텍스트 색상
                            trailColor: '#e8e8e8', // 배경 색상
                        })}
                    />
                    <button
                        className="mt-10 px-8 py-2 bg-blue-500 text-white rounded-lg"
                        onClick={() => {
                            setRemainingTime(30);  // 준비 시간 30초로 재설정
                            setCurrentStep('ready');  // 준비 시작
                        }}
                    >
                        바로 시작
                    </button>
                </div>
            )}

            {currentStep === 'ready' && (
                <div className="text-center">
                    <CircularProgressbar
                        value={(remainingTime / 30) * 100}
                        text={
                             <tspan>
                                <tspan x="50%" dy="-3em" fontSize="0.45rem" fill="#0093E9">준비 시간</tspan> 
                                <tspan x="50%" dy="1em" fontSize="1.5rem" fontWeight="bold" textAnchor="middle">{`0${Math.floor(remainingTime / 60)}:${("0" + (remainingTime % 60)).slice(-2)}`}</tspan>
                            </tspan>
                        }
                        styles={buildStyles({
                            pathColor: 'url(#blueGradient)', // 프로그레스 바 색상
                            textColor: '#0093E9', // 텍스트 색상
                            trailColor: '#e8e8e8', // 배경 색상
                        })}
                    />
                    <button
                        className="mt-10 px-8 py-2 bg-blue-500 text-white rounded-lg"
                        onClick={() => {
                            setCurrentStep('answering');  // 질문 답변 시작
                            setAnswerTime(120);  // 답변 시간 2분 설정
                        }}
                    >
                        답변 시작
                    </button>
                </div>
            )}

            {currentStep === 'answering' && (
                <div className="text-center">
                    <CircularProgressbar
                        value={(answerTime / 120) * 100}
                        text={
                             <tspan>
                                <tspan x="50%" dy="-3em" fontSize="0.45rem" fill="#C850C0">답변 시간</tspan> 
                                <tspan x="50%" dy="1em" fontSize="1.5rem" fontWeight="bold" textAnchor="middle">{`0${Math.floor(answerTime / 60)}:${("0" + (answerTime % 60)).slice(-2)}`}</tspan>
                            </tspan>
                        }
                        styles={buildStyles({
                            pathColor: 'url(#redGradient)', // 프로그레스 바 색상
                            textColor: '#C850C0', // 텍스트 색상
                            trailColor: '#e8e8e8', // 배경 색상
                        })}
                    />
                    <button
                        className="mt-10 px-8 py-2 bg-blue-500 text-white rounded-lg"
                        onClick={() => moveToNextStep()}
                    >
                        {currentQuestionIndex < totalQuestions - 1 ? '다음 질문' : '면접 종료'}
                    </button>
                </div>
            )}
        </div>
    </div>
</div>
    );
};

export default InterviewStartPage;
