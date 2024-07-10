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
    <div ref={ref} className="flex w-full min-h-1280 items-center justify-center">
      <motion.div
        initial="hidden"
        animate={controls}
        variants={imageVariants}
        className="flex-1 max-w-md"
      >
        <img src={Sec2Img} alt="섹션2 이미지" className="w-full" />
      </motion.div>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={textVariants}
        className="flex-1 pl-8 max-w-md"
      >
        <h2 className="text-3xl font-bold mb-4">Section 2</h2>
        <p className="text-lg">This is the content of section 2.</p>
      </motion.div>
    </div>
  );
};

export default Section2;
