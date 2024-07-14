import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Sec2Img from '../../../assets/img/section2.png';

const Section2 = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const imageVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <div ref={ref} className="flex max-w-8xl min-h-screen items-center justify-center bg-indigo-50">
      <div className="flex w-3/4">
      <motion.div
        initial="hidden"
        animate={controls}
        variants={imageVariants}
        className="w-3/4"
      >
        <img src={Sec2Img} alt="섹션2 이미지" className="w-full" />
      </motion.div>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={textVariants}
        className="w-1/4 flex flex-col justify-center ml-4 mt-50"
      >
        <h2 className="text-4xl font-bold mb-2">AI기반으로 생성된<p></p>개인 맞춤형 질문</h2>
        <p className="text-xl font-300">생성형 ai를 이용하여<p></p>사용자의 자기소개서에 기반한<p></p>맞춤형 질문을 제공합니다.</p>
      </motion.div>
      </div>
    </div>
  );
};

export default Section2;
