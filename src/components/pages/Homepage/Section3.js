import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import FeedbackImg from '../../../assets/img/FeedbackImg.png';

const Section3 = () => {
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

  const variants = {
    hidden: { opacity: 0, y: 0 },
    visible: { opacity: 1, y: 100, transition: { duration: 0.8, delay: 0.2 } },
  };

  return (
    <div className="bg-gradient-to-b from-indigo-100 to-white">
    <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={variants}
          className="flex flex-col items-center justify-center h-screen"
      >
        <h2 className="text-4xl font-bold mb-2 text-center">AI 면접 분석 제공</h2>
        <p className="text-xl font-300">자세한 피드백으로 효과적인 면접 연습을 할 수 있습니다.</p>
        <div className="flex items-center justify-center">
          <motion.img
              src={FeedbackImg}
              alt="AI 모의면접 이미지"
              className="w-5/6 h-auto"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Section3;
