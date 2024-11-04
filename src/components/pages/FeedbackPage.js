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

// Radar 차트를 그리기 위해 필요한 구성 요소들을 Chart.js에 등록합니다.
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
  const [gazeData, setGazeData] = useState({ gaze: 0, gazeMessage: '' }); // 시선 분석 데이터를 저장할 상태

  useEffect(() => {
    const token = localStorage.getItem('userToken');  // 사용자 토큰 가져오기
    const interviewId = resultData?.interviewId;
    const fetchGazeData = async () => {
      try {
        const response = await axios.get(`https://namanba.shop/api/${interviewId}/evaluate-gaze`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setGazeData(response.data.data); // 받아온 시선 분석 데이터를 상태에 저장
      } catch (error) {
        console.error('시선 분석 데이터를 가져오는 중 오류가 발생했습니다:', error);
      }
    };

    if (resultData?.interviewId) {
      fetchGazeData();
    }
  }, [resultData]);

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
        label: '', // 제목 라벨을 빈 문자열로 설정하여 안 보이게 만듭니다.
        data: [gazeData.gaze, 1, 2, 3, 3, 3], // 여기에 실제 데이터를 넣을 수 있습니다.
        backgroundColor: 'rgba(0, 0, 139, 0.2)', // 남색으로 변경 (rgba로 투명도 설정)
        borderColor: 'rgba(0, 0, 139, 1)', // 남색으로 변경
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
          <h1 className="text-3xl font-semibold text-blue-700 mb-8">000님의 면접 분석 결과입니다.</h1>

          <div className="flex flex-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* 분석 결과 텍스트 */}
            <div>
              <h2 className="text-xl font-semibold mb-1">시선 처리</h2>
              <p className="mb-4">
                {gazeData.gazeMessage}
              </p>

              <h2 className="text-xl font-semibold mb-1">제스처</h2>
              <p className="mb-4">
                답변 중 손을 사용하여 적극적으로 제스처를 하여 자신감이 느껴집니다. 그러나 지나치게 제스처가 많아 산만할 수 있습니다.
              </p>

              <h2 className="text-xl font-semibold mb-1">표정</h2>
              <p className="mb-4">
                면접 내내 미소를 유지하며 긍정적인 인상을 주었습니다. 그러나 때때로 눈썹을 찌푸리거나 인상을 쓰는 모습이 관찰되었습니다.
              </p>

              <h2 className="text-xl font-semibold mb-1">목소리 크기</h2>
              <p className="mb-4">
                목소리는 명확하고 적절한 크기를 유지하며 잘 전달됩니다. 다만, 답변 중간에 목소리가 작아지는 경향이 있어 주의가 필요합니다.
              </p>

              <h2 className="text-xl font-semibold mb-1">발화 속도</h2>
              <p className="mb-4">
                발화 속도는 일반적으로 적절하지만, 긴장할 때는 조금 빠르게 말하는 경향이 있습니다. 이는 답변의 이해를 어렵게 만들 수 있습니다.
              </p>

              <h2 className="text-xl font-semibold mb-1">침묵 시간</h2>
              <p className="mb-4">
                답변 중간에 적절한 침묵 시간을 가지며, 생각을 정리하는 모습이 보였습니다. 그러나 긴 침묵이 몇 번 있었습니다, 이는 준비 부족을 나타낼 수 있습니다.
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
