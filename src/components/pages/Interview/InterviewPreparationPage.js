import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import MainHeader from '../../molecules/Header/MainHeader';

const InterviewPreparationPage = () => {
    const videoRef = useRef(null); // 비디오 요소 참조
    const canvasRef = useRef(null); // 캔버스 요소 참조
    const [voiceDetected, setVoiceDetected] = useState(false); // 음성 인식 여부 상태 변수
    const [faceDetected, setFaceDetected] = useState(false); // 얼굴 인식 여부 상태 변수

    const navigate = useNavigate();
    const handleNavigation = (path) => {
        navigate(path);
    };

    useEffect(() => {
        const setupMediaDevices = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    }
                });

                const videoStream = new MediaStream(stream.getVideoTracks());
                const videoElement = videoRef.current;

                if (videoElement) {
                    videoElement.srcObject = videoStream;

                    videoElement.onloadedmetadata = () => {
                        videoElement.play().catch(error => console.error('Video play error:', error));

                        // 모델 로드 후 detectFace 호출
                        loadFaceApiModel();
                    };
                }

                setupAudio(stream); // 오디오 설정
            } catch (error) {
                console.error('Error accessing media devices.', error);
                alert('카메라와 마이크 권한이 필요합니다.');
            }
        };

        const setupAudio = (stream) => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);

            analyser.fftSize = 512;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const detectVoice = () => {
                analyser.getByteFrequencyData(dataArray);
                const sum = dataArray.reduce((a, b) => a + b, 0);
                const average = sum / dataArray.length;

                if (average > 30) {
                    setVoiceDetected(true);
                } else {
                    setVoiceDetected(false);
                }

                requestAnimationFrame(detectVoice);
            };

            detectVoice();
        };

        const loadFaceApiModel = async () => {
            // TinyFaceDetector 모델 로드
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');

            // 모델 로드 후 얼굴 인식 시작
            detectFace();
        };

        const detectFace = async () => {
            const videoElement = videoRef.current;

            const detect = async () => {
                if (videoElement && videoElement.readyState >= 2) {
                    const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions());

                    if (detections.length > 0) {
                        setFaceDetected(true);
                    } else {
                        setFaceDetected(false);
                    }
                }

                requestAnimationFrame(detect);
            };

            detect();
        };

        setupMediaDevices();

        return () => {
            const videoElement = videoRef.current;
            if (videoElement && videoElement.srcObject) {
                const stream = videoElement.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                videoElement.srcObject = null;
            }
        };
    }, [videoRef]); // videoRef를 의존성 배열에 추가

    // useEffect(() => {
    //     const setupMediaDevices = async () => {
    //         try {
    //             const stream = await navigator.mediaDevices.getUserMedia({
    //                 video: true,
    //                 audio: {
    //                     echoCancellation: true,
    //                     noiseSuppression: true,
    //                     autoGainControl: true,
    //                 }
    //             });
    //
    //             const videoStream = new MediaStream(stream.getVideoTracks());
    //             if (videoRef.current) {
    //                 const videoElement = videoRef.current;
    //                 videoElement.srcObject = videoStream;
    //
    //                 videoElement.onloadedmetadata = () => {
    //                     videoElement.play().catch(error => console.error('Video play error:', error));
    //
    //                     // 모델 로드 후 detectFace 호출
    //                     loadFaceApiModel();
    //                 };
    //             }
    //
    //             setupAudio(stream); // 오디오 설정
    //         } catch (error) {
    //             console.error('Error accessing media devices.', error);
    //             alert('카메라와 마이크 권한이 필요합니다.');
    //         }
    //     };
    //
    //     const setupAudio = (stream) => {
    //         const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    //         const analyser = audioContext.createAnalyser();
    //         const microphone = audioContext.createMediaStreamSource(stream);
    //         microphone.connect(analyser);
    //
    //         analyser.fftSize = 512;
    //         const bufferLength = analyser.frequencyBinCount;
    //         const dataArray = new Uint8Array(bufferLength);
    //
    //         const detectVoice = () => {
    //             analyser.getByteFrequencyData(dataArray);
    //             const sum = dataArray.reduce((a, b) => a + b, 0);
    //             const average = sum / dataArray.length;
    //
    //             if (average > 30) {
    //                 setVoiceDetected(true);
    //             } else {
    //                 setVoiceDetected(false);
    //             }
    //
    //             requestAnimationFrame(detectVoice);
    //         };
    //
    //         detectVoice();
    //     };
    //
    //     const loadFaceApiModel = async () => {
    //         // TinyFaceDetector 모델 로드
    //         await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    //
    //         // 모델 로드 후 얼굴 인식 시작
    //         detectFace();
    //     };
    //
    //     const detectFace = async () => {
    //         const videoElement = videoRef.current;
    //
    //         const detect = async () => {
    //             if (videoElement && videoElement.readyState >= 2) {
    //                 const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions());
    //
    //                 if (detections.length > 0) {
    //                     setFaceDetected(true);
    //                 } else {
    //                     setFaceDetected(false);
    //                 }
    //             }
    //
    //             requestAnimationFrame(detect);
    //         };
    //
    //         detect();
    //     };
    //
    //     setupMediaDevices();
    //
    //     return () => {
    //         const videoElement = videoRef.current;
    //         if (videoElement && videoElement.srcObject) {
    //             const stream = videoElement.srcObject;
    //             const tracks = stream.getTracks();
    //             tracks.forEach(track => track.stop());
    //             videoElement.srcObject = null;
    //         }
    //     };
    // }, []);

    return (
        <div className="flex flex-col h-screen">
            <MainHeader />
            <div className="flex flex-1 flex-col items-center justify-center mx-4 my-8 p-4">
                <div className="relative w-full max-w-3xl mb-4">
                    <video ref={videoRef} className="w-full h-auto rounded-lg shadow-lg" />
                    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
                </div>
                <div className="mt-4 text-center">
                    <p className="text-xl font-semibold text-gray-700">음성 인식 상태: <span className={voiceDetected ? 'text-green-500' : 'text-red-500'}>{voiceDetected ? "인식됨" : "인식되지 않음"}</span></p>
                    <p className="text-xl font-semibold text-gray-700">얼굴 인식 상태: <span className={faceDetected ? 'text-green-500' : 'text-red-500'}>{faceDetected ? "인식됨" : "인식되지 않음"}</span></p>
                    <p className="text-md text-gray-500 mt-2">카메라와 마이크가 정상적으로 작동하는지 확인하세요.</p>
                    {!voiceDetected && <p className="text-red-500 font-bold mt-2">음성인식 실패: 음성이 감지되지 않습니다.</p>}
                    {!faceDetected && <p className="text-red-500 font-bold mt-2">얼굴인식 실패: 얼굴이 감지되지 않습니다.</p>}
                </div>
                <div className="mt-6 flex justify-center space-x-4">
                    <button
                        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleNavigation('/inputinfo')}
                        >면접 시작</button>
                    <button
                        className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
                        onClick={() => handleNavigation('/inputinfo')}
                        >이전</button>
                </div>
            </div>
        </div>
    );
};

export default InterviewPreparationPage;
