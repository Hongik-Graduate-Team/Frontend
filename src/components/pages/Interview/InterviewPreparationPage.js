// import React, { useRef, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import * as tf from '@tensorflow/tfjs';
// import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
// import '@tensorflow/tfjs-backend-webgl';
// import MainHeader from '../../molecules/Header/MainHeader';

const InterviewPreparationPage = () => {
//     const videoRef = useRef(null); // 비디오 요소 참조
//     const canvasRef = useRef(null); // 캔버스 요소 참조
//     const [voiceDetected, setVoiceDetected] = useState(false); // 음성 인식 여부 상태 변수
//     const [faceDetected, setFaceDetected] = useState(false); // 얼굴 인식 여부 상태 변수

//     const navigate = useNavigate();
//     const handleNavigation = (path) => {
//         navigate(path);
//     };

//     useEffect(() => {
//         const videoElement = videoRef.current;

//         // 카메라와 마이크 설정 함수
//         const setupMediaDevices = async () => {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({
//                     video: true,
//                     audio: {
//                         echoCancellation: true, // 에코 취소 기능 활성화
//                         noiseSuppression: true, // 잡음 억제 기능 활성화
//                         autoGainControl: true, // 자동 게인 조절 기능 활성화
//                     }
//                 });

//                 // 비디오 스트림에서 오디오 트랙 제거
//                 const videoStream = new MediaStream(stream.getVideoTracks());
//                 if (videoElement) {
//                     videoElement.srcObject = videoStream; // 비디오 요소에 스트림 할당
//                     videoElement.onloadedmetadata = () => {
//                         if (videoElement) {
//                             videoElement.play().catch(error => console.error('Video play error:', error)); // play() 호출 및 에러 처리
//                         }
//                     };
//                 }

//                 setupAudio(stream); // 오디오 설정
//                 detectFace(); // 얼굴 인식 설정
//             } catch (error) {
//                 console.error('Error accessing media devices.', error);
//                 alert('카메라와 마이크 권한이 필요합니다.'); // 권한 요청 실패 시 알림
//             }
//         };

//         // 오디오 설정 함수
//         const setupAudio = (stream) => {
//             const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // 오디오 컨텍스트 생성
//             const analyser = audioContext.createAnalyser(); // 오디오 분석기 생성
//             const microphone = audioContext.createMediaStreamSource(stream); // 마이크 스트림 소스 생성
//             microphone.connect(analyser); // 마이크와 분석기 연결

//             // 마이크를 오디오 출력 장치(스피커)로 연결하지 않음

//             analyser.fftSize = 512; // FFT 크기 설정
//             const bufferLength = analyser.frequencyBinCount;
//             const dataArray = new Uint8Array(bufferLength);

//             // 음성 검출 함수
//             const detectVoice = () => {
//                 analyser.getByteFrequencyData(dataArray); // 주파수 데이터 가져오기
//                 const sum = dataArray.reduce((a, b) => a + b, 0); // 모든 주파수 데이터 합계
//                 const average = sum / dataArray.length; // 평균 계산

//                 // 음성 검출 여부 설정
//                 if (average > 30) { // 적절한 임계값 설정 (테스트 후 조정 가능)
//                     setVoiceDetected(true);
//                 } else {
//                     setVoiceDetected(false);
//                 }

//                 requestAnimationFrame(detectVoice); // 다음 프레임에 detectVoice 함수 호출
//             };

//             detectVoice(); // 음성 검출 시작
//         };

//         // 얼굴 인식 설정 함수
//         const detectFace = async () => {
//             await tf.setBackend('webgl');
//             await tf.ready();

//             // MediaPipeFaceMesh 모델을 사용하여 얼굴 감지기 생성
//             const model = await faceLandmarksDetection.createDetector(faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh, {
//                 runtime: 'mediapipe',
//                 refineLandmarks: true,
//                 solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh`
//             });

//             const detect = async () => {
//                 if (videoElement.readyState >= 2) { // 비디오가 준비되었을 때
//                     const predictions = await model.estimateFaces(videoElement);
//                     if (predictions.length > 0) {
//                         setFaceDetected(true); // 얼굴 감지됨
//                     } else {
//                         setFaceDetected(false); // 얼굴 감지되지 않음
//                     }

//                     const canvas = canvasRef.current;
//                     const ctx = canvas.getContext('2d');
//                     if (ctx) {
//                         ctx.clearRect(0, 0, canvas.width, canvas.height);
//                         predictions.forEach(prediction => {
//                             const keypoints = prediction.keypoints;
//                             keypoints.forEach(({ x, y }) => {
//                                 ctx.beginPath();
//                                 ctx.arc(x * canvas.width, y * canvas.height, 2, 0, 2 * Math.PI);
//                                 ctx.fillStyle = 'red';
//                                 ctx.fill();
//                             });
//                         });
//                     }
//                 }
//                 requestAnimationFrame(detect); // 다음 프레임에 detect 함수 호출
//             };

//             detect(); // 얼굴 감지 시작
//         };

//         setupMediaDevices(); // 미디어 장치 설정 시작

//         return () => {
//             if (videoElement && videoElement.srcObject) {
//                 const stream = videoElement.srcObject;
//                 const tracks = stream.getTracks();
//                 tracks.forEach(track => track.stop()); // 모든 미디어 트랙 중지
//                 videoElement.srcObject = null; // srcObject 제거
//             }
//         };
//     }, []);

//     return (
//         <div className="flex flex-col h-screen">
//             <MainHeader />
//             <div className="flex flex-1 flex-col items-center justify-center mx-4 my-8 p-4">
//                 <div className="relative w-full max-w-3xl mb-4">
//                     <video ref={videoRef} className="w-full h-auto rounded-lg shadow-lg" />
//                     <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
//                 </div>
//                 <div className="mt-4 text-center">
//                     <p className="text-xl font-semibold text-gray-700">음성 인식 상태: <span className={voiceDetected ? 'text-green-500' : 'text-red-500'}>{voiceDetected ? "인식됨" : "인식되지 않음"}</span></p>
//                     <p className="text-xl font-semibold text-gray-700">얼굴 인식 상태: <span className={faceDetected ? 'text-green-500' : 'text-red-500'}>{faceDetected ? "인식됨" : "인식되지 않음"}</span></p>
//                     <p className="text-md text-gray-500 mt-2">카메라와 마이크가 정상적으로 작동하는지 확인하세요.</p>
//                     {!voiceDetected && <p className="text-red-500 font-bold mt-2">음성인식 실패: 음성이 감지되지 않습니다.</p>}
//                     {!faceDetected && <p className="text-red-500 font-bold mt-2">얼굴인식 실패: 얼굴이 감지되지 않습니다.</p>}
//                 </div>
//                 <div className="mt-6 flex justify-center space-x-4">
//                     <button
//                         className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
//                         onClick={() => handleNavigation('/inputinfo')}
//                         >면접 시작</button>
//                     <button
//                         className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
//                         onClick={() => handleNavigation('/inputinfo')}
//                         >이전</button>
//                 </div>
//             </div>
//         </div>
//     );
};

export default InterviewPreparationPage; // 컴포넌트 내보내기