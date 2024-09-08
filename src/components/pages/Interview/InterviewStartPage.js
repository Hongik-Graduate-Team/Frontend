import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';

const InterviewStartPage = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [remainingTime, setRemainingTime] = useState(30);
    const [isReady, setIsReady] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerTime, setAnswerTime] = useState(120);
    const totalQuestions = 5;

    // 음성 재생 기능 추가
    useEffect(() => {
        if (isReady) {
            const speech = new SpeechSynthesisUtterance();
            speech.text = "지금부터 면접을 시작하겠습니다. 준비시간이 끝나면 자동으로 녹화가 시작됩니다.";
            speech.lang = "ko-KR";
            window.speechSynthesis.speak(speech);
        }
    }, [isReady]);

    useEffect(() => {
        if (remainingTime > 0 && isReady) {
            const timer = setTimeout(() => setRemainingTime(remainingTime - 1), 1000);
            return () => clearTimeout(timer);
        } else if (remainingTime === 0) {
            setIsReady(false);
        }
    }, [remainingTime, isReady]);

    // 다음 질문으로 이동하는 함수
    const moveToNextQuestion = useCallback(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setAnswerTime(120);
        } else {
            alert("모든 질문이 완료되었습니다.");
            navigate('/interview-end');
        }
    }, [currentQuestionIndex, totalQuestions, navigate]);

    // 답변 시간 카운트다운
    useEffect(() => {
        let timer;
        if (!isReady && answerTime > 0) {
            timer = setInterval(() => setAnswerTime(answerTime - 1), 1000);
        }
        if (answerTime === 0) {
            moveToNextQuestion();
        }
        return () => clearInterval(timer);
    }, [answerTime, isReady, moveToNextQuestion]);

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

    return (
        <div className="relative flex flex-col items-center justify-center h-screen bg-gray-100">
            {/* 비디오 화면 */}
            <video ref={videoRef} className="absolute w-full h-full object-cover z-0" />

            {/* 준비 중일 때 보여줄 안내 문구 */}
            {isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="text-center text-white">
                        <p className="text-3xl font-bold">지금부터 면접을 시작하겠습니다.</p>
                        <p className="text-xl mt-2">준비시간이 끝나면 자동으로 녹화가 시작됩니다.</p>
                        <div className="text-5xl text-pink-500 mt-4">{remainingTime}초</div>
                        <button
                            className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg"
                            onClick={() => setIsReady(false)}
                        >
                            바로 답변하기
                        </button>
                    </div>
                </div>
            )}

            {/* 면접 질문 부분 */}
            {!isReady && (
                <div className="flex flex-col items-center z-10">
                    <div className="text-2xl font-bold mb-4">
                        질문 {currentQuestionIndex + 1} / {totalQuestions}
                    </div>
                    <div className="text-center">
                        <p className="text-2xl mb-4">질문에 답변하세요.</p>
                        <div className="text-4xl text-red-500">
                            {Math.floor(answerTime / 60)}:{("0" + (answerTime % 60)).slice(-2)}
                        </div>
                        <button
                            className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg"
                            onClick={moveToNextQuestion}
                        >
                            다음 질문으로 이동하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewStartPage;
