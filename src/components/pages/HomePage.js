import React from 'react';
import MainHeader from '../molecules/MainHeader';
import Section1 from '../molecules/sections/Section1';
import Section2 from '../molecules/sections/Section2';
import Section3 from '../molecules/sections/Section3';
import MainImg from '../../assets/img/main.png';

const HomePage = () => {
    return (
        <div>
            <MainHeader />
            <div className="flex flex-col items-center w-full">
                <div className="flex justify-center items-center w-full max-w-7xl">
                    <div className="flex flex-col items-start">
                        <h1 className="text-7xl font-black mb-6">면접은
                        <p className="mt-2" />
                        나만바</h1>
                        <h3 className="text-2xl mb-10">지금 바로 나만의 면접 바이블과 함께<br></br> 완벽한 면접 준비를 시작하세요!</h3>
                        <button className="px-6 py-3 bg-indigo-500 text-white font-regular text-lg rounded-xl shadow-xl hover:bg-indigo-600">
                            면접 시작하기
                        </button>
                    </div>
                    <div className="w-3/5">
                        <img src={MainImg} alt="메인 이미지"/>
                    </div>
                </div>
            </div>
            <Section1 />
            <Section2 />
            <Section3 />
        </div>
    );
};

export default HomePage;
