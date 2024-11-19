import { useEffect, useState, useRef } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Pose } from '@mediapipe/pose';
import axios from 'axios';

const GazePoseAnalysis = ({ videoRef, isAnswering, interviewEnded, interviewId }) => {
  const [gazeData, setGazeData] = useState([]);  // 시선 데이터를 저장하는 상태
  const [directionCounts, setDirectionCounts] = useState({
    up: 0, down: 0, left: 0, right: 0, centerX: 0, centerY: 0
  }); // 시선 방향별 카운트
  const [postureData, setPostureData] = useState({
    headTouch: 0, excessiveArmMovement: 0,
    headMovement: 0, excessiveBodyMovement: 0
  }); // 제스처 카운트
  const latestGazePoint = useRef(null);  // 최신 시선 좌표를 참조하는 ref
  const animationId = useRef(null);  // 애니메이션 프레임 ID를 참조하는 ref
  const isAnsweringRef = useRef(isAnswering); // isAnswering의 현재 상태를 참조하는 ref (useEffect로 업데이트)
  // gazeData와 directionCounts의 최신 상태를 참조하기 위한 ref
  const gazeDataRef = useRef(gazeData);
  const directionCountsRef = useRef(directionCounts);
  const postureDataRef = useRef(postureData);
  const previousPosition = useRef(null);

  // 평균 위치 계산 함수
  const calculateAveragePosition = (gazeData) => {
    const sum = gazeData.reduce(
      (acc, point) => {
        acc.x += point.x;
        acc.y += point.y;
        return acc;
      },
      { x: 0, y: 0 }
    );
    return { x: sum.x / gazeData.length, y: sum.y / gazeData.length };
  };

  // 안정성(분산) 계산 함수
  const calculateStability = (gazeData, avgPosition) => {
    const variance = gazeData.reduce(
      (acc, point) => {
        acc.x += Math.pow(point.x - avgPosition.x, 2);
        acc.y += Math.pow(point.y - avgPosition.y, 2);
        return acc;
      },
      { x: 0, y: 0 }
    );
    return {
      varianceX: variance.x / gazeData.length,
      varianceY: variance.y / gazeData.length,
    };
  };

  // 백엔드에 분석 결과 전송 함수
  const sendGazeAnalysisToBackend = (avgPosition, stability, directionCounts, interviewId) => {
    const stabilityScore = Math.sqrt(stability.varianceX + stability.varianceY);  // 안정성 점수 계산
    const token = localStorage.getItem('userToken');  // 사용자 토큰 가져오기
  
    const dataToPost = {
      stabilityScore,
      directionCounts,
    };

    console.log('Analysis sent:', dataToPost);
  
    axios.post(`https://namanba.shop/api/${interviewId}/evaluate-gaze`, dataToPost, {
      headers: {
        Authorization: `Bearer ${token}`,  // 인증 헤더 설정
      },
    })
      .then((response) => {
        console.log('Gaze analysis results sent successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error sending gaze analysis results:', error);
      });
  };

  // 포즈 분석 결과 전송 함수
  const sendPostureAnalysisToBackend = (postureData, interviewId) => {
    const token = localStorage.getItem('userToken');
    console.log('Analysis sent:', postureData);

    axios.post(`https://namanba.shop/api/${interviewId}/evaluate-gesture`, postureData, {
      headers: { 
        Authorization: `Bearer ${token}`, 
      },
    })
      .then((response) => {
        console.log('Posture analysis results sent successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error sending posture analysis results:', error);
      });
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    let faceMesh, pose;

    // 얼굴 분석 루프 함수
    const analyzeFrame = async () => {
      if (faceMesh && pose && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
        await faceMesh.send({ image: videoElement });
        await pose.send({ image: videoElement });
      }
      animationId.current = requestAnimationFrame(analyzeFrame);
    };

    if (videoElement) {
      faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      // FaceMesh 옵션 설정
      faceMesh.setOptions({
        maxNumFaces: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        refineLandmarks: true,
      });

      // FaceMesh 분석 결과 처리
      faceMesh.onResults((results) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];
          const leftEyeCenter = {
            x: (landmarks[133].x + landmarks[33].x) / 2,
            y: (landmarks[133].y + landmarks[33].y) / 2,
          };
          const rightEyeCenter = {
            x: (landmarks[362].x + landmarks[263].x) / 2,
            y: (landmarks[362].y + landmarks[263].y) / 2,
          };
          const gazePoint = {
            x: (leftEyeCenter.x + rightEyeCenter.x) / 2,
            y: (leftEyeCenter.y + rightEyeCenter.y) / 2,
          };

          const leftIris = { x: landmarks[468].x, y: landmarks[468].y };
          const rightIris = { x: landmarks[473].x, y: landmarks[473].y };

          const direction = { x: 'centerX', y: 'centerY' };
          const irisThresholdX = 0.01;
          const irisThresholdY = 0.005;

          if (leftIris.x > leftEyeCenter.x + irisThresholdX || rightIris.x > rightEyeCenter.x + irisThresholdX) {
            direction.x = 'left';
          } else if (leftIris.x < leftEyeCenter.x - irisThresholdX || rightIris.x < rightEyeCenter.x - irisThresholdX) {
            direction.x = 'right';
          } else {
            direction.x = 'centerX';
          }

          if (leftIris.y > leftEyeCenter.y + 0.0005 || rightIris.y > rightEyeCenter.y + 0.0005) {
            direction.y = 'down';
          } else if (leftIris.y < leftEyeCenter.y - irisThresholdY || rightIris.y < rightEyeCenter.y - irisThresholdY) {
              direction.y = 'up';
          } else {
              direction.y = 'centerY';
          }

          latestGazePoint.current = gazePoint;

          // 답변 시간에만 gazeData에 추가
          if (isAnsweringRef.current) {
            setGazeData((prevData) => [...prevData, latestGazePoint.current]);
            setDirectionCounts((prevCounts) => ({
              ...prevCounts,
              [direction.x]: prevCounts[direction.x] + 1,
              [direction.y]: prevCounts[direction.y] + 1,
            }));
          }
        } else {
          console.warn('No face landmarks detected.');
          latestGazePoint.current = null;
        }
      });

      pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      // pose 옵션 설정
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      // Pose 분석 결과 처리
      pose.onResults((results) => {
        if (results.poseLandmarks && results.poseLandmarks.length > 0) {
          const landmarks = results.poseLandmarks;
          
          const leftIndex = { x: landmarks[19].x, y: landmarks[19].y };
          const rightIndex = { x: landmarks[20].x, y: landmarks[20].y };
          const leftWrist = { x: landmarks[15].x, y: landmarks[15].y, v: landmarks[15].visibility};
          const rightWrist = { x: landmarks[16].x, y: landmarks[16].y, v: landmarks[16].visibility };
          const isLeftWristVisible = leftWrist.v > 0.5;
          const isRightWristVisible = rightWrist.v > 0.5;
          const nose = { x: landmarks[0].x, y: landmarks[0].y };
          const leftShoulder = { x: landmarks[11].x, y: landmarks[11].y, v: landmarks[11].visibility };
          const rightShoulder = { x: landmarks[12].x, y: landmarks[12].y, v: landmarks[12].visibility };
          const averageShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 };
          const isLeftShoulderVisible = leftShoulder.v > 0.5;
          const isRightShoulderVisible = rightShoulder.v > 0.5;
      
          const distance = (pointA, pointB) => {
            if (!pointA || !pointB) return Infinity;
            return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
          };
      
          if (isAnsweringRef.current) {
            setPostureData((prevData) => {
              const newPostureData = { ...prevData };
      
              // 머리 만지는 행동 감지
              if  (distance(leftIndex, nose) < 0.25 || distance(rightIndex, nose) < 0.25) {
                newPostureData.headTouch++;
              }
      
              // 과도한 팔 움직임 감지
              if (isLeftWristVisible || isRightWristVisible) {
                if (isLeftWristVisible) {
                  const leftMovement = distance(leftWrist, previousPosition.leftWrist);
                  if (leftMovement > 0.1) {
                    newPostureData.excessiveArmMovement++;
                  }
                  previousPosition.leftWrist = { x: leftWrist.x, y: leftWrist.y };
                }
                if (isRightWristVisible) {
                  const rightMovement = distance(rightWrist, previousPosition.rightWrist);
                  if (rightMovement > 0.1) {
                    newPostureData.excessiveArmMovement++;
                  }
                  previousPosition.rightWrist = { x: rightWrist.x, y: rightWrist.y };
                }
              }
      
              // 과도한 고개 움직임 감지
              if (nose) {
                const headMovement = distance(nose, previousPosition.nose);
                if (headMovement > 0.03) {
                  newPostureData.headMovement++;
                }
                previousPosition.nose = { x: nose.x, y: nose.y };
              }
                    
              // 과도한 몸 움직임 감지
              if (isLeftShoulderVisible || isRightShoulderVisible) {
                const bodyMovement = distance(averageShoulder, previousPosition.shoulder);
                if (bodyMovement > 0.03) {
                  newPostureData.excessiveBodyMovement++;
                }
                previousPosition.shoulder = { x:averageShoulder.x, y: averageShoulder.y };
              }
            
              // postureDataRef와 동기화
              postureDataRef.current = newPostureData;   
              return newPostureData;
            });
          }
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

  // gazeData와 directionCounts가 변경될 때 ref 업데이트
  useEffect(() => {
    gazeDataRef.current = gazeData;
  }, [gazeData]);

  useEffect(() => {
    directionCountsRef.current = directionCounts;
  }, [directionCounts]);

  // 인터뷰 종료 후 시선 데이터가 있을 경우 분석 및 전송
  useEffect(() => {
    if (interviewEnded && gazeDataRef.current.length > 0) {
      const avgPosition = calculateAveragePosition(gazeDataRef.current);
      const stability = calculateStability(gazeDataRef.current, avgPosition);
      const directionCounts = directionCountsRef.current;
      const postureData = postureDataRef.current;
      sendGazeAnalysisToBackend(avgPosition, stability, directionCounts, interviewId);
      sendPostureAnalysisToBackend(postureData, interviewId);
    }
  }, [interviewEnded, interviewId]);

  return null;
};

export default GazePoseAnalysis;
