import { useEffect, useState, useRef } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import axios from 'axios';

const GazeAnalysis = ({ videoRef, isAnswering, interviewEnded, interviewId }) => {
  const [gazeData, setGazeData] = useState([]);  // 시선 데이터를 저장하는 상태
  const [directionCounts, setDirectionCounts] = useState({up: 0, down: 0, left: 0, right: 0, centerX: 0, centerY: 0 }); // 시선 방향별 카운트
  const latestGazePoint = useRef(null);  // 최신 시선 좌표를 참조하는 ref
  const animationId = useRef(null);  // 애니메이션 프레임 ID를 참조하는 ref
  const isAnsweringRef = useRef(isAnswering); // isAnswering의 현재 상태를 참조하는 ref (useEffect로 업데이트)
  // gazeData와 directionCounts의 최신 상태를 참조하기 위한 ref
  const gazeDataRef = useRef(gazeData);
  const directionCountsRef = useRef(directionCounts);

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

  useEffect(() => {
    const videoElement = videoRef.current;
    let faceMesh;

    // 얼굴 분석 루프 함수
    const analyzeFrame = async () => {
      if (faceMesh && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
        await faceMesh.send({ image: videoElement });
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
            // console.log(latestGazePoint.current, direction.y, direction.x);
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
      sendGazeAnalysisToBackend(avgPosition, stability, directionCounts, interviewId);
    }
  }, [interviewEnded, interviewId]);

  return null;
};

export default GazeAnalysis;