import React from "react";
import { motion } from "framer-motion";
const HeroText = ({ text }) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, duration: 1},
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 400,
      transition: {
        type: "spring",
        duration: 0.5//, repeat: Infinity
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5//, repeat: Infinity
      },
    },
  };

  return (
    <motion.div
      className=" z-50 flex justify-center mt-[21%] h-[500px] items-center ultra"

      style={{ overflow: "hidden", display: "flex"}}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
        className=" text-[50px]"
          variants={child}
          style={{ marginRight: "0px" }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default HeroText;