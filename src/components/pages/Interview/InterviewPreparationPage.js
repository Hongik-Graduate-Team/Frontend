import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-backend-webgl';
import MainHeader from '../../molecules/Header/MainHeader';

const InterviewPreparationPage = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [decibel, setDecibel] = useState(0);

    useEffect(() => {
        // 지역 변수로 videoRef의 현재 값 저장
        const videoElement = videoRef.current;

        const setupCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoElement) {
                    videoElement.srcObject = stream;
                    videoElement.play();
                }
                return stream;
            } catch (error) {
                console.error('Error accessing media devices.', error);
                alert('카메라와 마이크 권한이 필요합니다.');
            }
        };

        const detectFace = async (stream) => {
            try {
                await tf.setBackend('webgl');
                await tf.ready();

                const model = await faceLandmarksDetection.createDetector(faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh, {
                    runtime: 'mediapipe',
                    refineLandmarks: true,
                    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh`
                });

                const video = videoElement;

                const detect = async () => {
                    if (video && video.readyState >= 2) { // Video element has enough data to start detecting
                        const predictions = await model.estimateFaces(video);
                        const canvas = canvasRef.current;
                        const ctx = canvas.getContext('2d');

                        if (ctx) {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);

                            if (predictions.length > 0) {
                                predictions.forEach(prediction => {
                                    const keypoints = prediction.keypoints;
                                    keypoints.forEach(({ x, y }) => {
                                        ctx.beginPath();
                                        ctx.arc(x * canvas.width, y * canvas.height, 1, 0, 2 * Math.PI);
                                        ctx.fill();
                                    });
                                });
                            }
                        }
                    }
                    requestAnimationFrame(detect);
                };

                detect();
            } catch (error) {
                console.error('Error loading the face detection model.', error);
            }
        };

        const setupAudio = (stream) => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const calculateDecibels = () => {
                analyser.getByteFrequencyData(dataArray);
                const sum = dataArray.reduce((a, b) => a + b, 0);
                const average = sum / dataArray.length;
                const decibel = Math.round(average);
                setDecibel(decibel);

                requestAnimationFrame(calculateDecibels);
            };

            calculateDecibels();
        };

        // Set up camera, then detect faces and set up audio
        const initialize = async () => {
            const stream = await setupCamera();
            detectFace(stream);
            setupAudio(stream);
        };

        initialize();

        return () => {
            if (videoElement && videoElement.srcObject) {
                const stream = videoElement.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop()); // Stop all media tracks
            }
        };
    }, []);

    return (
        <div className="flex flex-col h-screen">
            <MainHeader />
            <div className="flex flex-1 flex-col items-center justify-center bg-white">
                <div className="relative w-full max-w-3xl">
                    <video ref={videoRef} className="w-full h-auto" />
                    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
                </div>
                <div className="mt-4 text-center">
                    <p className="text-xl">현재 데시벨: {decibel} dB</p>
                    {decibel < 70 && <p className="text-red-500 font-bold">음성인식 실패: 데시벨이 너무 낮습니다.</p>}
                </div>
            </div>
        </div>
    );
};

export default InterviewPreparationPage;
