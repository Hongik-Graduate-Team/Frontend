import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Section3 = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div ref={ref} className="flex max-w-8xl min-h-screen items-center justify-center bg-indigo-100">
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="section"
    >
      <h2>Section 3</h2>
      <p>This is the content of section 3.</p>
    </motion.div>
    </div>
  );
};

export default Section3;
