import React, {useRef, useEffect, useState, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import MainHeader from '../../molecules/Header/MainHeader';
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import VoiceFaceRecognition from './VoiceFaceRecognition';
import useInterviewRecorder from './InterviewRecorder';


const InterviewStartPage = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [isInterviewStarted] = useState(true);
    const [remainingTime, setRemainingTime] = useState(30);  // 시간 설정
    const [currentStep, setCurrentStep] = useState('announcement');  // 현재 단계 (announcement, ready, answering)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);  // 현재 질문 번호
    const [answerTime, setAnswerTime] = useState(120);  // 답변 시간 (2분)
    const totalQuestions = 5;  // 총 질문 개수
    const [faceLostTime, setFaceLostTime] = useState(0);  // 얼굴이 인식되지 않는 시간
    const [faceDetected, setFaceDetected] = useState(true); // 얼굴이 인식되었는지 여부
    const [noAudioDetectedTime, setNoAudioDetectedTime] = useState(0);  // 음성이 인식되지 않는 시간 기록
    const { startRecording, pauseRecording, stopRecording } = useInterviewRecorder({
        videoRef,
        setRecordedChunks,
    });

    const getRecordedVideoUrl = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        return URL.createObjectURL(blob);
    };

    // 다음 단계로 이동하는 함수 (다음 질문 또는 면접 종료)
    const moveToNextStep = useCallback(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setCurrentStep('ready');  // 다음 질문 전 준비 시간 시작
            setRemainingTime(30);  // 준비 시간 30초 재설정
        } else {
            alert("모든 질문이 완료되었습니다. 면접을 종료합니다.");
            stopRecording(); // 마지막 질문 녹화 중지
            const mergedVideoURL = getRecordedVideoUrl();  // 병합된 영상의 URL 생성
            navigate('/feedback', { state: { video: mergedVideoURL } });  // 영상을 전달
        }
    }, [currentQuestionIndex, totalQuestions, navigate, getRecordedVideoUrl, stopRecording]);

    // 얼굴 인식 경고 표시
    useEffect(() => {
        if (currentStep === 'answering' && !faceDetected) {
            const timer = setInterval(() => {
                setFaceLostTime((prevTime) => prevTime + 1);
            }, 1000); // 1초마다 faceLostTime 증가

            return () => clearInterval(timer); // cleanup 함수로 타이머 정리
        } else {
            // 얼굴이 다시 인식되면 faceLostTime을 0으로 초기화
            setFaceLostTime(0);
        }
    }, [faceDetected, currentStep]);

    useEffect(() => {
        if (currentStep === 'answering' && faceLostTime >= 3) {
            console.warn("얼굴이 인식되지 않습니다!");
        }
    }, [faceLostTime, currentStep]);

    // 음성 재생 기능 추가 (안내 문구 재생)
    useEffect(() => {
        if (currentStep === 'announcement') {
            const speech = new SpeechSynthesisUtterance();
            speech.text = "지금부터 면접을 시작하겠습니다. 준비시간이 끝나면 자동으로 녹화가 시작됩니다.";
            speech.lang = "ko-KR";
            window.speechSynthesis.speak(speech);
        }

        // 컴포넌트가 언마운트되거나 단계가 변경될 때 음성을 중지
        return () => {
            window.speechSynthesis.cancel();
        };
    }, [currentStep]);

    // 단계 전환 로직
    // 준비 시간 타이머 설정
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
                setAnswerTime(prevTime => prevTime - 1);
            }, 1000);

            // 타이머를 청소하는 클린업 함수
            return () => clearTimeout(timer);
        }
    }, [answerTime, currentStep]);

    useEffect(() => {
        if (answerTime === 0 && currentStep === 'answering') {
            // 녹화를 일시 중지하고 다음 단계로 이동
            pauseRecording();
            moveToNextStep();
        }
    }, [answerTime, currentStep, pauseRecording, moveToNextStep]);


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

    const GradientSVG = () => (
        <svg style={{height: 0}}>
            <defs>
                <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D9AFD9"/>
                    {/* 시작 색상 */}
                    <stop offset="100%" stopColor="#97D9E1"/>
                    {/* 끝 색상 */}
                </linearGradient>

                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#80D0C7"/>
                    {/* 시작 색상 */}
                    <stop offset="100%" stopColor="#0093E9"/>
                    {/* 끝 색상 */}
                </linearGradient>

                <linearGradient id="redGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5D67FF"/>
                    {/* 시작 색상 */}
                    <stop offset="100%" stopColor="#FF3C3C"/>
                    {/* 끝 색상 */}
                </linearGradient>
            </defs>
        </svg>
    );

    return (
        <div className="relative flex flex-col items-center justify-start min-h-screen">
            <MainHeader isInterviewStarted={isInterviewStarted}/>
            <VoiceFaceRecognition
                videoRef={videoRef}
                setFaceDetected={setFaceDetected}
                setNoAudioDetectedTime={setNoAudioDetectedTime}
                setFaceLostTime={setFaceLostTime}
            />

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
                        </button>
                        <br/>
                        <p className="text-3xl font-semibold mb-4">여기 질문 내용이 들어갑니다.</p>
                    </div>
                )}

                {currentStep === 'answering' && (
                    <div>
                        <button
                            className="px-3 py-1 text-teal-400 text-xl font-semibold bg-teal-50 rounded-md mb-4"
                        >
                            질문 {currentQuestionIndex + 1} / {totalQuestions}
                        </button>
                        <br/>
                        <p className="text-3xl font-semibold mb-4">질문 내용내용</p>
                    </div>
                )}
            </div>

            {/* 화면과 오른쪽 정보 및 버튼 */}
            <div className="flex w-full max-w-7xl mt-4">
                {/* 비디오 화면 - 왼쪽 */}
                <div className="flex-grow-[1] relative">
                    {/* 비디오 화면 */}
                    <video ref={videoRef} className="rounded-lg shadow-xl w-full"/>

                    {/* 두 가지 경고가 모두 해당되는 경우 */}
                    {currentStep === 'answering' && faceLostTime >= 3 && noAudioDetectedTime >= 5 && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-start justify-center pt-12">
                            <p className="text-red-500 text-xl font-semibold">
                                얼굴과 음성이 인식되지 않습니다. 카메라와 마이크를 확인해 주세요.
                            </p>
                    </div>
                    )}

                    {/* 얼굴 인식 경고 */}
                    {currentStep === 'answering' && faceLostTime >= 3 && noAudioDetectedTime < 5 && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-start justify-center pt-12">
                            <p className="text-red-500 text-xl font-semibold">
                                얼굴이 인식되지 않습니다. 카메라를 확인해 주세요.
                            </p>
                        </div>
                    )}

                    {/* 음성 인식 경고 */}
                    {currentStep === 'answering' && noAudioDetectedTime >= 5 && faceLostTime < 3 && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-start justify-center pt-12">
                            <p className="text-red-500 text-xl font-semibold">
                                음성이 감지되지 않았습니다. 마이크를 확인해 주세요.
                            </p>
                        </div>
                    )}
                </div>

                {/* 시간 및 버튼 - 오른쪽 */}
                <div className="flex-grow-[1] basis-1/4 flex flex-col items-center justify-center p-3 rounded-lg">
                    <GradientSVG/>

                    {/* 준비 시간 단계 */}
                    {currentStep === 'announcement' && (
                        <div className="text-center">
                            <CircularProgressbar
                                value={(remainingTime / 30) * 100}
                                text={
                                    <tspan>
                                        <tspan x="50%" dy="-3em" fontSize="0.45rem" fill="#97D9E1">준비 시간</tspan>
                                        <tspan x="50%" dy="1em" fontSize="1.5rem" fontWeight="bold"
                                               textAnchor="middle">{`0${Math.floor(remainingTime / 60)}:${("0" + (remainingTime % 60)).slice(-2)}`}</tspan>
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
                                    window.speechSynthesis.cancel();
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
                                        <tspan x="50%" dy="1em" fontSize="1.5rem" fontWeight="bold"
                                               textAnchor="middle">{`0${Math.floor(remainingTime / 60)}:${("0" + (remainingTime % 60)).slice(-2)}`}</tspan>
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
                                        <tspan x="50%" dy="1em" fontSize="1.5rem" fontWeight="bold"
                                               textAnchor="middle">{`0${Math.floor(answerTime / 60)}:${("0" + (answerTime % 60)).slice(-2)}`}</tspan>
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
}
export default InterviewStartPage;
