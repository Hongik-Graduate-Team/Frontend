import { useRef, useEffect, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';

const VoiceFaceRecognition = ({ videoRef, setFaceDetected, setNoAudioDetectedTime, isAnswering, interviewEnded, interviewId }) => {
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const [faceLostTime, setFaceLostTime] = useState(0);
    const [hasSentData, setHasSentData] = useState(false);

    // 표정 카운트 상태 추가
    const [expressionsCount, setExpressionsCount] = useState({
        neutral: 0,
        happy: 0,
        sad: 0,
        angry: 0,
        fearful: 0,
        disgusted: 0,
        surprised: 0,
    });
    const [totalFrames, setTotalFrames] = useState(0);

    const sendExpressionDataToBackend = useCallback(async (interviewId, data) => {
        console.log('백엔드로 전송할 표정 데이터:', data);
        try {
            const kakaoToken = localStorage.getItem('kakaoToken');
            await axios.post(`https://namanba.shop/api/${interviewId}/expression`, {
                neutral: data.neutral,
                happy: data.happy,
                sad: data.sad,
                angry: data.angry,
                fearful: data.fearful,
                disgusted: data.disgusted,
                surprised: data.surprised,
                totalFrames: data.totalFrames
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                    'Content-Type': 'application/json',
                    'Kakao-Token': kakaoToken,
                },
            });
            console.log('표정 데이터가 백엔드로 전송되었습니다:', data);
        } catch (error) {
            console.error('표정 데이터 전송 중 오류 발생:', error);
        }
    }, []);

    // isAnswering 상태를 참조하는 ref
    const isAnsweringRef = useRef(isAnswering);

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

                    if (volume >= 3) {
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
                console.error('마이크 접근 오류:', err);
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
                        videoElement.play().catch(error => console.error('비디오 재생 오류:', error));
                        loadFaceApiModel();
                    };
                }
            } catch (error) {
                console.error('미디어 장치 접근 오류:', error);
                alert('카메라 권한이 필요합니다.');
            }
        };

        const loadFaceApiModel = async () => {
            try {
                console.log('모델 파일 로드 시작');
                await faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector_model-weights_manifest.json');
                await faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68_model-weights_manifest.json');
                await faceapi.nets.faceRecognitionNet.loadFromUri('/models/face_recognition_model-weights_manifest.json');
                await faceapi.nets.faceExpressionNet.loadFromUri('/models/face_expression_model-weights_manifest.json');
                console.log('모델 파일 로드 완료');
                detectFaceAndExpressions();
            } catch (error) {
                console.error('모델 파일 로드 오류:', error);
            }
        };

        const detectFaceAndExpressions = () => {
            const detect = async () => {
                if (videoElement && videoElement.readyState >= 2) {
                    const minConfidence = 0.5;
                    const displaySize = { width: videoElement.videoWidth, height: videoElement.videoHeight };
                    faceapi.matchDimensions(videoElement, displaySize);

                    const detections = await faceapi
                        .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: minConfidence }))
                        .withFaceExpressions();

                    if (detections.length > 0) {
                        setFaceDetected(true);
                        setFaceLostTime(0);

                        const resizedDetections = faceapi.resizeResults(detections, displaySize);
                        const expressions = resizedDetections[0].expressions;

                        // 답변 시간 동안만 표정 분석 데이터 업데이트
                        if (isAnsweringRef.current) {
                            setExpressionsCount(prevCounts => {
                                const updatedCounts = {
                                    neutral: prevCounts.neutral + (expressions.neutral > 0.5 ? 1 : 0),
                                    happy: prevCounts.happy + (expressions.happy > 0.5 ? 1 : 0),
                                    sad: prevCounts.sad + (expressions.sad > 0.5 ? 1 : 0),
                                    angry: prevCounts.angry + (expressions.angry > 0.3 ? 1 : 0),
                                    fearful: prevCounts.fearful + (expressions.fearful > 0.5 ? 1 : 0),
                                    disgusted: prevCounts.disgusted + (expressions.disgusted > 0.5 ? 1 : 0),
                                    surprised: prevCounts.surprised + (expressions.surprised > 0.5 ? 1 : 0),
                                };
                                console.log("업데이트된 표정 카운트:", updatedCounts);
                                return updatedCounts;
                            });
                            setTotalFrames(prevFrames => prevFrames + 1);
                        }
                    } else {
                        setFaceDetected(false);
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

    // 면접이 끝났을 때 표정 데이터 전송
    useEffect(() => {
        if (interviewEnded && !hasSentData) {
            const expressionData = {
                neutral: expressionsCount.neutral,
                happy: expressionsCount.happy,
                sad: expressionsCount.sad,
                angry: expressionsCount.angry,
                fearful: expressionsCount.fearful,
                disgusted: expressionsCount.disgusted,
                surprised: expressionsCount.surprised,
                totalFrames: totalFrames,
            };
            console.log("백엔드로 전송할 데이터:", expressionData);
            sendExpressionDataToBackend(interviewId, expressionData);
            setHasSentData(true); // 데이터를 전송한 후에는 플래그를 true로 설정합니다.
        }
    }, [interviewEnded, expressionsCount, totalFrames, sendExpressionDataToBackend, interviewId, hasSentData]);

    useEffect(() => {
        if (faceLostTime >= 3) {
            console.warn('얼굴이 3초 이상 인식되지 않았습니다.');
        }
    }, [faceLostTime]);

    // isAnswering 상태 변경 시 isAnsweringRef 업데이트
    useEffect(() => {
        isAnsweringRef.current = isAnswering;
    }, [isAnswering]);

    return null;
};

export default VoiceFaceRecognition;
