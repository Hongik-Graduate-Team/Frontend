import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';

const InterviewStartPage = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
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
            navigate('/interview-end');  // 면접 종료 페이지로 이동
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
        if (remainingTime > 0) {
            const timer = setTimeout(() => setRemainingTime(remainingTime - 1), 1000);
            return () => clearTimeout(timer);
        } else if (remainingTime === 0) {
            if (currentStep === 'announcement') {
                setCurrentStep('ready');  // 안내사항이 끝나면 준비 시간으로 이동
            } else if (currentStep === 'ready') {
                setCurrentStep('answering');  // 준비 시간이 끝나면 질문 답변 시간으로 이동
                setAnswerTime(120);  // 답변 시간 재설정
                startRecording();  // 답변 시간이 시작되면 녹화 시작
            } else if (currentStep === 'answering') {
                moveToNextStep();  // 답변 시간이 끝나면 다음 단계로 이동
            }
        }
    }, [remainingTime, currentStep, moveToNextStep]);  // moveToNextStep 추가

    // 답변 시간 카운트다운
    useEffect(() => {
        let timer;
        if (currentStep === 'answering' && answerTime > 0) {
            timer = setInterval(() => setAnswerTime(answerTime - 1), 1000);
        }
        if (answerTime === 0 && currentStep === 'answering') {
            setCurrentStep('ready');  // 답변 시간이 끝나면 준비 시간으로 이동
            setRemainingTime(30);  // 준비 시간 30초 재설정
            stopRecording();  // 답변 시간이 끝나면 녹화 중지
        }
        return () => clearInterval(timer);
    }, [answerTime, currentStep]);

    // Face-api를 이용해 얼굴을 인식하고 비디오 출력
    useEffect(() => {
        const videoElement = videoRef.current;

        const setupMediaDevices = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
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

    return (
        <div className="relative flex flex-col items-center justify-center h-screen bg-gray-100">
            {/* 비디오 화면 */}
            <video ref={videoRef} className="absolute w-full h-full object-cover z-0" />

            {/* 안내사항 30초 동안 보여줄 문구 */}
            {currentStep === 'announcement' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="text-center text-white">
                        <p className="text-3xl font-bold">지금부터 면접을 시작하겠습니다.</p>
                        <p className="text-xl mt-2">준비시간이 끝나면 자동으로 녹화가 시작됩니다.</p>
                        <div className="text-5xl text-pink-500 mt-4">{remainingTime}초</div>
                        {/* 버튼 추가 */}
                        <button
                            className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg"
                            onClick={() => {
                                setRemainingTime(30);  // 준비 시간 30초로 재설정
                                setCurrentStep('ready');  // 준비 시작
                            }}
                        >
                            다음으로 넘어가기
                        </button>
                    </div>
                </div>
            )}

            {/* 준비 시간 30초 동안 질문을 보여줌 */}
            {currentStep === 'ready' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="text-center text-white">
                        <div className="text-2xl font-bold mb-4">
                            질문 {currentQuestionIndex + 1} / {totalQuestions}
                        </div>
                        <p className="text-xl">다음 질문에 답변을 준비하세요:</p>
                        <p className="text-2xl mt-4">여기 질문 내용이 들어갑니다.</p>
                        <div className="text-5xl text-blue-500 mt-4">{remainingTime}초</div>
                        {/* 버튼 추가 */}
                        <button
                            className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg"
                            onClick={() => {
                                setCurrentStep('answering');  // 질문 답변 시작
                                setAnswerTime(120);  // 답변 시간 2분 설정
                            }}
                        >
                            바로 답변 시작하기
                        </button>
                    </div>
                </div>
            )}

            {/* 답변 시간 동안 질문에 답변 */}
            {currentStep === 'answering' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="text-center text-white">
                        <div className="text-2xl font-bold mb-4">
                            질문 {currentQuestionIndex + 1} / {totalQuestions}
                        </div>
                        <p className="text-2xl mb-4">질문에 답변하세요.</p>
                        <div className="text-4xl text-red-500">
                            {Math.floor(answerTime / 60)}:{("0" + (answerTime % 60)).slice(-2)}
                        </div>
                        {/* 마지막 질문이면 '면접 종료하기' 버튼, 아니면 '다음 질문으로' 버튼 */}
                        <button
                            className="mt-8 px-6 py-3 bg-green-500 text-white rounded-lg"
                            onClick={() => moveToNextStep()}
                        >
                            {currentQuestionIndex < totalQuestions - 1 ? '다음 질문으로' : '면접 종료하기'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewStartPage;
