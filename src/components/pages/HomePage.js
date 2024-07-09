import React from 'react';
import MainHeader from '../molecules/MainHeader';
import Section1 from '../molecules/sections/Section1';
import Section2 from '../molecules/sections/Section2';
import Section3 from '../molecules/sections/Section3';
import MainImg from '../../assets/img/Main.png';

const HomePage = () => {
    return (
        <div>
            <MainHeader />
            <div className="flex flex-col items-center w-full">
                <div className="flex justify-between items-center w-full max-w-6xl mt-10 p-8">
                    <div className="flex flex-col items-start">
                        <h1 className="text-7xl font-bold mb-4">면접은<p className="mt-2"></p>나만바</h1>
                        <h3 className="text-2xl mb-10">나만바소개소개소갯고새 소개소개소갯괘</h3>
                        <button className="px-6 py-3 bg-indigo-500 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-indigo-600">
                            면접 시작하기
                        </button>
                    </div>
                    <div className="w-1/2">
                        <img src={MainImg} alt="면접 이미지"/>
                    </div>
                </div>
            </div>
            <h1>Home Page</h1>
            {/* 홈 페이지 내용 작성 */}
            <Section1 />
            <Section2 />
            <Section3 />
        </div>
    );
};

export default HomePage;
