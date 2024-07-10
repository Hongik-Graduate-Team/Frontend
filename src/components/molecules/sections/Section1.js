import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import IntroImg from '../../../assets/img/Intro.png';

const Section1 = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
  };

  return (
      <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={variants}
          className="flex flex-col items-center justify-center h-screen"
      >
        <h2 className="text-4xl font-bold mb-4 text-center">나만바 AI모의면접 서비스</h2>
        <div className="flex items-center justify-center">
          <motion.img
              src={IntroImg}
              alt="AI 모의면접 이미지"
              className="rounded-lg max-w-full h-auto" // 이미지 크기 조정을 위해 max-w-full과 h-auto 추가
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </motion.div>
  );
};

export default Section1;

