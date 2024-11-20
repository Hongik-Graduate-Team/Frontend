import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import MainHeader from '../molecules/Header/MainHeader';
import axios from 'axios';
import LoadingImg from '../../assets/img/loading.gif';

// Radar 차트를 그리기 위해 필요한 구성 요소들을 Chart.js에 등록
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const FeedbackPage = () => {
  const location = useLocation();
  const resultData = location.state; // 이전 페이지에서 넘겨받은 데이터
  const [loading, setLoading] = useState(true);
  const [gazeData, setGazeData] = useState({ gaze: 0, gazeMessage: '' }); // 시선 분석 데이터
  const [gestureData, setGestureData] = useState({ gesture: 0, gestureMessage: '' }) // 자세 분석 데이터
  const [expressionData, setExpressionData] = useState({ expression: 0, expressionMessage: '' }); // 표정 분석 데이터
  const [audioData, setAudioData] = useState({
    silenceDuration: 0,
    voiceVolume: 0,
    speechRate: 0,
    silenceDurationMessage: '',
    voiceVolumeMessage: '',
    speechRateMessage: '' }) // 음성 분석 데이터
  const [nickname, setNickname] = useState(''); // 사용자 이름
  

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const interviewId = resultData?.interviewId;

    const fetchFeedbackData = async () => {
      try {
        const requests = [
          axios.get(`https://namanba.shop/api/${interviewId}/evaluate-gaze`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://namanba.shop/api/${interviewId}/evaluate-gesture`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://namanba.shop/api/${interviewId}/expression`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://namanba.shop/api/${interviewId}/audio`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://namanba.shop/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ];

        const results = await Promise.allSettled(requests);

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            switch (index) {
              case 0: // Gaze 데이터
                setGazeData(result.value.data.data && typeof result.value.data.data === 'object'
                  ? result.value.data.data
                  : { gaze: 0, gazeMessage: '데이터를 불러오지 못했습니다.' });
                break;
              case 1: // Gesture 데이터
                setGestureData(result.value.data.data && typeof result.value.data.data === 'object'
                  ? result.value.data.data
                  : { gesture: 0, gestureMessage: '데이터를 불러오지 못했습니다.' });
                break;
              case 2: // Expression 데이터
                setExpressionData(result.value.data.data && typeof result.value.data.data === 'object'
                  ? result.value.data.data
                  : { expression: 0, expressionMessage: '데이터를 불러오지 못했습니다.' });
                break;
              case 3: // Audio 데이터
                setAudioData(result.value.data.data && typeof result.value.data.data === 'object'
                  ? result.value.data.data
                  : {
                      silenceDuration: 0,
                      voiceVolume: 0,
                      speechRate: 0,
                      silenceDurationMessage: '데이터를 불러오지 못했습니다.',
                      voiceVolumeMessage: '데이터를 불러오지 못했습니다.',
                      speechRateMessage: '데이터를 불러오지 못했습니다.',
                    });
                break;
              case 4: // 닉네임 데이터
                setNickname(result.value.data.data && typeof result.value.data.data === 'string'
                  ? result.value.data.data
                  : '회원');
                break;
              default:
                break;
            }
          } else {
            // 실패한 요청 처리
            console.error(`Request ${index + 1} failed:`, result.reason);
        
            const defaultErrorMessage = '데이터를 불러오지 못했습니다.';
            switch (index) {
              case 0: // Gaze 데이터
                setGazeData({ gaze: 0, gazeMessage: defaultErrorMessage });
                break;
              case 1: // Gesture 데이터
                setGestureData({ gesture: 0, gestureMessage: defaultErrorMessage });
                break;
              case 2: // Expression 데이터
                setExpressionData({ expression: 0, expressionMessage: defaultErrorMessage });
                break;
              case 3: // Audio 데이터
                setAudioData({
                  silenceDuration: 0,
                  voiceVolume: 0,
                  speechRate: 0,
                  silenceDurationMessage: defaultErrorMessage,
                  voiceVolumeMessage: defaultErrorMessage,
                  speechRateMessage: defaultErrorMessage,
                });
                break;
              case 4: // 닉네임 데이터
                setNickname('회원');
                break;
              default:
                break;
            }
          }
        });
      } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false); // 모든 요청이 끝난 후 로딩 상태 종료
      }
    };

    const timer = setTimeout(() => {
      if (resultData?.interviewId) {
        fetchFeedbackData();
        }
      }, 5000);
      return () => clearTimeout(timer);
    }, [resultData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <p className="text-2xl font-semibold mb-4 text-center">피드백 데이터를 로딩 중입니다.<br />잠시만 기다려주세요.</p>
          <img
            src={LoadingImg}
            alt={"LoadingImg"}
            className="mt-5 w-1/3"
          />
        </div>
      </div>
    );
  }

  // 면접 영상 다운로드 함수
  const handleDownload = () => {
    const videoUrl = resultData?.video; // 전달된 video URL 사용
    console.log("다운로드할 비디오 URL:", videoUrl);
    if (videoUrl) {
      try {
        const link = document.createElement('a');
        link.href = videoUrl;
        link.setAttribute('download', 'interview_video.webm'); // 다운로드할 파일명
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        alert('비디오 다운로드 중 오류가 발생했습니다.');
        console.error('Download error:', error);
      }
    } else {
      alert('영상 URL을 찾을 수 없습니다.');
    }
  };

  const data = {
    labels: ['시선 처리', '제스처', '침묵 시간', '발화 속도', '목소리 크기', '표정'],
    datasets: [
      {
        label: '',
        data: [gazeData.gaze,
               gestureData.gesture,
               audioData.silenceDuration,
               audioData.speechRate,
               audioData.voiceVolume,
               expressionData.expression],
        backgroundColor: 'rgba(0, 0, 139, 0.2)',
        borderColor: 'rgba(0, 0, 139, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        min: 0, // 최솟값 설정
        max: 5, // 최댓값 설정
        ticks: {
          stepSize: 1, // 각 스텝의 크기
        },
        pointLabels: {
          font: {
            size: 14, // 글씨 크기 조정
            weight: 'bold',
        },
      },
    },
  }};

  return (
    <div className="min-h-screen">
      <MainHeader /> {/* 헤더를 페이지 맨 위에 배치합니다 */}
      <div className="flex flex-col items-center justify-center">
        <div className="bg-gray-50 shadow-md p-8 mt-4 w-full max-w-7xl">
          <h1 className="text-3xl font-semibold text-indigo-600 mb-8">
            {nickname}님의 면접 분석 결과입니다.
          </h1>

          <div className="flex flex-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* 분석 결과 텍스트 */}
            <div>
              <h2 className="text-xl font-semibold mb-1">시선 처리</h2>
              <p className="mb-4">
                {gazeData.gazeMessage}
              </p>

              <h2 className="text-xl font-semibold mb-1">제스처</h2>
              <p className="mb-4">
                {gestureData.gestureMessage}
              </p>

              <h2 className="text-xl font-semibold mb-1">표정</h2>
              <p className="mb-4">
                {expressionData.expressionMessage}
              </p>

              <h2 className="text-xl font-semibold mb-1">목소리 크기</h2>
              <p className="mb-4">
                {audioData.voiceVolumeMessage}
              </p>

              <h2 className="text-xl font-semibold mb-1">발화 속도</h2>
              <p className="mb-4">
                {audioData.speechRateMessage}
              </p>

              <h2 className="text-xl font-semibold mb-1">침묵 시간</h2>
              <p className="mb-4">
                {audioData.silenceDurationMessage}
              </p>
            </div>

            {/* 분석 결과 차트 */}
            <div className="w-1/2 flex flex-col items-center justify-center">
              {/* 그래프 크기 조절 */}
              <div className="md:w-full" style={{ height: '400px' }}>
                <Radar data={data} options={options} />
              </div>

              {/* 면접 영상 다운로드 버튼을 그래프 바로 밑으로 이동 */}
              <div className="mt-10">
                <button
                  className="px-5 py-3 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600"
                  onClick={handleDownload}>
                  면접 영상 다운로드
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
