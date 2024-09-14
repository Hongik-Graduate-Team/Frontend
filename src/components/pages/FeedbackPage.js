import React from 'react';
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

// Radar 차트를 그리기 위해 필요한 구성 요소들을 Chart.js에 등록합니다.
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const InterviewResultPage = () => {
  const data = {
    labels: ['시선 처리', '제스처', '침묵 시간', '발화 속도', '목소리 크기', '표정'],
    datasets: [
      {
        label: '면접 분석 결과',
        data: [4, 3, 2, 4, 3, 4], // 여기에 실제 데이터를 넣을 수 있습니다.
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scale: {
      ticks: { beginAtZero: true, min: 0, max: 5, stepSize: 1 },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-blue-500 mb-6">000님의 면접 분석 결과입니다.</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 분석 결과 텍스트 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">시선 처리</h2>
            <p className="mb-4">
              사용자는 면접관과 눈을 자주 마주치지만, 가끔 시선을 아래로 돌리는 경향이 있습니다. 이는 때때로 자신감 부족으로 보일 수 있습니다.
            </p>

            <h2 className="text-xl font-semibold mb-4">제스처</h2>
            <p className="mb-4">
              답변 중 손을 사용하여 적극적으로 제스처를 하여 자신감이 느껴집니다. 그러나 지나치게 제스처가 많아 산만할 수 있습니다.
            </p>

            <h2 className="text-xl font-semibold mb-4">표정</h2>
            <p className="mb-4">
              면접 내내 미소를 유지하며 긍정적인 인상을 주었습니다. 그러나 때때로 눈썹을 찌푸리거나 인상을 쓰는 모습이 관찰되었습니다.
            </p>

            <h2 className="text-xl font-semibold mb-4">목소리 크기</h2>
            <p className="mb-4">
              목소리는 명확하고 적절한 크기를 유지하며 잘 전달됩니다. 다만, 답변 중간에 목소리가 작아지는 경향이 있어 주의가 필요합니다.
            </p>

            <h2 className="text-xl font-semibold mb-4">발화 속도</h2>
            <p className="mb-4">
              발화 속도는 일반적으로 적절하지만, 긴장할 때는 조금 빠르게 말하는 경향이 있습니다. 이는 답변의 이해를 어렵게 만들 수 있습니다.
            </p>

            <h2 className="text-xl font-semibold mb-4">침묵 시간</h2>
            <p className="mb-4">
              답변 중간에 적절한 침묵 시간을 가지며, 생각을 정리하는 모습이 보였습니다. 그러나 긴 침묵이 몇 번 있었습니다, 이는 준비 부족을 나타낼 수 있습니다.
            </p>
          </div>

          {/* 분석 결과 차트 */}
          <div className="w-full">
            <Radar data={data} options={options} />
          </div>
        </div>

        {/* 면접 영상 다운로드 버튼 */}
        <div className="mt-8 flex justify-center">
          <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">
            면접 영상 다운로드
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewResultPage;
