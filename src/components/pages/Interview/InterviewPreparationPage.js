import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import MainHeader from '../../molecules/Header/MainHeader';

// 이미지 임포트
import voiceSuccessImage from '../../../assets/img/voice-success.png';
import voiceFailImage from '../../../assets/img/voice-fail.png';
import faceSuccessImage from '../../../assets/img/face-success.png';
import faceFailImage from '../../../assets/img/face-fail.png';

const InterviewPreparationPage = () => {
    const videoRef = useRef(null); // 비디오 요소를 참조하기 위한 useRef 훅
    const [voiceDetected, setVoiceDetected] = useState(false); // 음성 인식 여부 상태를 저장
    const [faceDetected, setFaceDetected] = useState(false); // 얼굴 인식 여부 상태를 저장

    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

    // 페이지 이동 함수
    const handleNavigation = (path) => {
        navigate(path);
    };

    useEffect(() => {
        const videoElement = videoRef.current;

        // 미디어 디바이스 설정
        const setupMediaDevices = async () => {
            try {
                // 카메라와 마이크에 접근하여 스트림을 가져옴
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    }
                });

                const videoStream = new MediaStream(stream.getVideoTracks());

                if (videoElement) {
                    videoElement.srcObject = videoStream; // 비디오 요소에 스트림을 설정

                    videoElement.onloadedmetadata = () => {
                        videoElement.play().catch(error => console.error('Video play error:', error));
                        loadFaceApiModel(); // 얼굴 인식 모델 로드
                    };
                }

                setupAudio(stream); // 오디오 설정
            } catch (error) {
                console.error('Error accessing media devices.', error);
                alert('카메라와 마이크 권한이 필요합니다.'); // 권한 오류 메시지
            }
        };

        // 오디오 설정
        const setupAudio = (stream) => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // 오디오 컨텍스트 생성
            const analyser = audioContext.createAnalyser(); // 분석기 생성
            const microphone = audioContext.createMediaStreamSource(stream); // 마이크로폰 소스 생성
            microphone.connect(analyser); // 분석기에 연결

            analyser.fftSize = 512; // FFT 크기 설정
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const detectVoice = () => {
                analyser.getByteFrequencyData(dataArray); // 음성 데이터 가져오기
                const sum = dataArray.reduce((a, b) => a + b, 0);
                const average = sum / dataArray.length;

                // 평균값에 따라 음성 인식 여부 결정
                if (average > 30) {
                    setVoiceDetected(true);
                } else {
                    setVoiceDetected(false);
                }

                requestAnimationFrame(detectVoice); // 다음 프레임에서 다시 호출
            };

            detectVoice();
        };

        // 얼굴 인식 모델 로드
        const loadFaceApiModel = async () => {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models'); // 모델 파일 로드
            detectFace(); // 얼굴 인식 시작
        };

        // 얼굴 인식 함수
        const detectFace = async () => {
            const detect = async () => {
                if (videoElement && videoElement.readyState >= 2) { // 비디오가 준비되었을 때
                    const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions()); // 얼굴 인식

                    // 얼굴 인식 여부 상태 업데이트
                    if (detections.length > 0) {
                        setFaceDetected(true);
                    } else {
                        setFaceDetected(false);
                    }
                }

                requestAnimationFrame(detect); // 다음 프레임에서 다시 호출
            };

            detect();
        };

        setupMediaDevices(); // 미디어 디바이스 설정 호출

        // 컴포넌트 언마운트 시 클린업 함수
        return () => {
            if (videoElement && videoElement.srcObject) {
                const stream = videoElement.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop()); // 트랙 중지
                videoElement.srcObject = null; // 비디오 소스 초기화
            }
        };
    }, [videoRef]); // videoRef가 변경될 때마다 이펙트 재실행

    return (
        <div className="flex flex-col h-screen">
            <MainHeader /> {/* 헤더 컴포넌트 */}
            <div className="flex flex-1 flex-col items-center justify-center mx-4 my-8 p-4">
                {/* 비디오와 이미지 컨테이너 */}
                <div className="flex items-center justify-center w-full max-w-6xl space-x-16">
                    {/* 비디오 화면 */}
                    <div className="relative">
                        <video ref={videoRef} className="w-[30rem] h-[30rem] rounded-lg shadow-lg" />
                    </div>
                    {/* 상태 이미지 */}
                    <div className="flex flex-col justify-between" style={{ height: '30rem', marginLeft: '1rem', marginRight: '1rem' }}>
                        {/* 음성 인식 이미지 */}
                        <img
                            src={voiceDetected ? voiceSuccessImage : voiceFailImage}
                            alt={voiceDetected ? "Voice recognized" : "Voice not recognized"}
                            className="w-[30rem] h-[50%] object-contain"
                        />
                        {/* 얼굴 인식 이미지 */}
                        <img
                            src={faceDetected ? faceSuccessImage : faceFailImage}
                            alt={faceDetected ? "Face recognized" : "Face not recognized"}
                            className="w-[30rem] h-[50%] object-contain"
                        />
                    </div>
                </div>
                {/* 버튼 */}
                <div className="mt-8 flex justify-center space-x-4">
                    <button
                        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleNavigation('/inputinfo')}
                    >
                        면접 시작
                    </button>
                    <button
                        className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
                        onClick={() => handleNavigation('/inputinfo')}
                    >
                        이전
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewPreparationPage;
