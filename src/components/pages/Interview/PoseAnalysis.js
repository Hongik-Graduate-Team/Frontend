import { useEffect, useState, useRef } from 'react';
import { Pose } from '@mediapipe/pose';
import axios from 'axios';

const PoseAnalysis = ({ videoRef, isAnswering, interviewEnded }) => {
  const [postureData, setPostureData] = useState({
    headTouchCount: 0,
    faceTouchCount: 0,
    excessiveArmMovement: 0,
    headMovementCount: 0,
    excessiveBodyMovement: 0,
  }); // 제스쳐 카운트
  const animationId = useRef(null);  // 애니메이션 프레임 ID를 참조하는 ref
  const isAnsweringRef = useRef(isAnswering); // isAnswering의 현재 상태를 참조하는 ref (useEffect로 업데이트)

  // 백엔드에 분석 결과 전송 함수
  const sendGazeAnalysisToBackend = (postureData) => {
    const token = localStorage.getItem('userToken');  // 사용자 토큰 가져오기
  
    const dataToPost = {
      postureData,
    };

    console.log('Analysis sent:', dataToPost);
  
    axios.post('/api/sendGazeAnalysisResults', dataToPost, {
      headers: {
        Authorization: `Bearer ${token}`,  // 인증 헤더 설정
      },
    })
      .then((response) => {
        console.log('Pose analysis results sent successfully:', response.data);
      })
      .catch((error) => {
        console.error('Pose sending gaze analysis results:', error);
      });
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    let pose;

    // 자세 분석 루프 함수
    const analyzeFrame = async () => {
      if (pose && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
        await pose.send({ image: videoElement });
      }
      animationId.current = requestAnimationFrame(analyzeFrame);
    };

    if (videoElement) {
      pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      // pose 옵션 설정
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
    });

      // Pose 분석 결과 처리
      pose.onResults((results) => {
        if (results.poseLandmarks && results.poseLandmarks.length > 0) {
          const landmarks = results.poseLandmarks[0];
          const leftWrist = landmarks[15];
          const rightWrist = landmarks[16];
          const leftShoulder = landmarks[11];
          const rightShoulder = landmarks[12];
          const nose = landmarks[0];
          const hipPosition = landmarks[24];

          // // 답변 시간에만 데이터에 추가
          // if (isAnsweringRef.current) {
          //   setPostureData((prevData) => {
          //     const newPostureData = { ...prevData };

          //     // 머리 만지는 행동 감지
          //     const distanceToHead = Math.sqrt(Math.pow(nose.x - leftWrist.x, 2) + Math.pow(nose.y - leftWrist.y, 2));
          //     if (distanceToHead < 0.1) newPostureData.headTouchCount++;

          //     // 얼굴에 손을 대는 행동 감지
          //     const faceYRange = [nose.y - 0.1, nose.y + 0.1];
          //     if (leftWrist.y >= faceYRange[0] && leftWrist.y <= faceYRange[1]) newPostureData.faceTouchCount++;
          //     if (rightWrist.y >= faceYRange[0] && rightWrist.y <= faceYRange[1]) newPostureData.faceTouchCount++;

          //     // 과도한 팔 움직임 감지
          //     const leftArmMovement = Math.abs(leftWrist.y - leftShoulder.y) > 0.1;
          //     const rightArmMovement = Math.abs(rightWrist.y - rightShoulder.y) > 0.1;
          //     if (leftArmMovement || rightArmMovement) newPostureData.excessiveArmMovement++;

          //     // 고개를 까닥이는 / 얼굴 각도 변화 감지
          //     const headNod = Math.abs(nose.y - leftShoulder.y) > 0.1 || Math.abs(nose.y - rightShoulder.y) > 0.1;
          //     if (headNod) newPostureData.headMovementCount++;

          //     // 과도한 몸의 움직임 감지
          //     const bodyMovement = Math.abs(hipPosition.x - (videoRef.current.videoWidth / 2)) > 0.1;
          //     if (bodyMovement) newPostureData.excessiveBodyMovement++;

          //     console.log(newPostureData);
          //     return newPostureData;
          //   });
          // }
        } else {
          console.warn('No landmarks detected.');
        }
      });

      // 비디오 데이터가 로드되면 분석 시작
      videoElement.addEventListener('loadeddata', () => {
        if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
          console.log("Video loaded, starting frame analysis.");
          animationId.current = requestAnimationFrame(analyzeFrame);
        } else {
          console.error("Video element has zero size");
        }
      });
    }

    // 컴포넌트 언마운트 시 애니메이션 중지 및 이벤트 리스너 제거
    return () => {
      cancelAnimationFrame(animationId.current);
      if (videoElement) {
        videoElement.removeEventListener('loadeddata', analyzeFrame);
      }
    };
  }, [videoRef]);

  // isAnswering 상태가 변경될 때 isAnsweringRef 업데이트
  useEffect(() => {
    isAnsweringRef.current = isAnswering;
  }, [isAnswering]);

  // 인터뷰 종료 후 전송
  useEffect(() => {
    if (interviewEnded) {
      sendGazeAnalysisToBackend(postureData);
    }
  }, [interviewEnded, postureData]);

  return null;
};

export default PoseAnalysis;
