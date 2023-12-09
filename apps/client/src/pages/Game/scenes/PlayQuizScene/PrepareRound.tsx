import React from "react";
import { motion } from "framer-motion";

export const PrepareRound: React.FC = () => {
  return (
    <motion.div className="flex flex-col items-center justify-center h-full gap-4">
      <motion.div
        className="text-2xl font-bold"
        initial={{ scale: 0.8, rotate: -30 }}
        animate={{
          scale: 1,
          rotate: 0,
        }}
        transition={{
          type: "spring",
          duration: 0.2,
          damping: 8,
        }}
      >
        라운드 1
      </motion.div>
      <motion.div
        className="h-24 w-64 rounded shadow-md bg-slate-300 flex items-center justify-center flex-col"
        initial={{ scale: 0.8, rotate: -30 }}
        animate={{
          scale: 1,
          rotate: 0,
        }}
        transition={{
          type: "spring",
          duration: 0.2,
          damping: 6,
        }}
      >
        <div className="font-bold text-base">💯 기본 점수</div>
        <div className="text-2xl font-bold">300</div>
      </motion.div>
      <motion.div
        className="h-24 w-64 rounded shadow-md bg-slate-300 flex items-center justify-center flex-col"
        initial={{ scale: 0.8, rotate: -30 }}
        animate={{
          scale: 1,
          rotate: 0,
        }}
        transition={{
          type: "spring",
          duration: 0.2,
          damping: 4,
        }}
      >
        <div className="font-bold text-base">💨 속도 점수</div>
        <div className="text-2xl font-bold">300</div>
      </motion.div>
    </motion.div>
  );
};
