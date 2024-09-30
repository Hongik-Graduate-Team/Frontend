import { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const VoiceFaceRecognition = ({ videoRef, setFaceDetected, setNoAudioDetectedTime }) => {
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const [faceLostTime, setFaceLostTime] = useState(0);

    // 오디오 스트림 처리
    useEffect(() => {
        const setupAudio = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioContextRef.current.createMediaStreamSource(stream);
                const analyser = audioContextRef.current.createAnalyser();
                analyser.fftSize = 2048;
                analyserRef.current = analyser;
                source.connect(analyser);

                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                let silenceStart = null;

                const checkVolume = () => {
                    analyser.getByteTimeDomainData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        sum += (dataArray[i] - 128) * (dataArray[i] - 128);
                    }
                    const volume = Math.sqrt(sum / dataArray.length);

                    if (volume >= 5) {
                        silenceStart = null;
                    } else {
                        if (!silenceStart) {
                            silenceStart = performance.now();
                        } else {
                            const silenceDuration = (performance.now() - silenceStart) / 1000;
                            setNoAudioDetectedTime(silenceDuration);
                        }
                    }
                    requestAnimationFrame(checkVolume);
                };
                checkVolume();
            } catch (err) {
                console.error('Error accessing microphone', err);
            }
        };
        setupAudio();
        return () => {
            const tracks = audioContextRef.current?.srcObject?.getTracks();
            tracks?.forEach(track => track.stop());
        };
    }, [setNoAudioDetectedTime]);

    // Face-api를 이용해 얼굴을 인식하고 비디오 출력
    useEffect(() => {
        const videoElement = videoRef.current;

        const setupMediaDevices = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                const audioTracks = stream.getAudioTracks();
                audioTracks.forEach(track => track.stop());

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

        const detectFace = () => {
            const detect = async () => {
                if (videoElement && videoElement.readyState >= 2) {
                    const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions());
                    if (detections.length > 0) {
                        setFaceDetected(true);
                        setFaceLostTime(0);
                    } else {
                        setFaceDetected(false);
                        // 얼굴이 인식되지 않으면 1초마다 faceLostTime을 증가시킴
                        setFaceLostTime(prevTime => prevTime + 1);
                    }
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
    }, [setFaceDetected, videoRef]);
    // 얼굴이 인식되지 않았을 때 faceLostTime을 이용해 메시지 표시
    useEffect(() => {
        if (faceLostTime >= 3) {
            console.warn('얼굴이 3초 이상 인식되지 않았습니다.');
        }
    }, [faceLostTime]);  // faceLostTime이 변경될 때마다 실행
    return null;
};

export default VoiceFaceRecognition;
