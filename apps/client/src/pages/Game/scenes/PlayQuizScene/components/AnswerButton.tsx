import React, { useMemo } from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import { cn } from "../../../../../lib/utils";

export const AnswerButton: React.FC<{
  isDisabled: boolean;
  isSelected?: boolean;
  isAnswer?: boolean;
  text: string;
  onClick?: () => void;
}> = ({ isDisabled, isSelected, isAnswer, text, onClick }) => {
  const state = useMemo(() => {
    if (isAnswer) {
      return "answer";
    }

    if (isDisabled) {
      return "disabled";
    }

    return "idle";
  }, [isDisabled, isAnswer]);

  return (
    <motion.button
      className={cn(
        `${styles.button}`,
        "w-full h-12 border-2 rounded-full",
        {
          [`${styles.selectedButton}`]: isSelected,
        },
        "text-sm font-bold break-keep text-ellipsis whitespace-nowrap overflow-hidden px-2"
      )}
      onClick={onClick}
      animate={state}
      variants={{
        idle: {
          backgroundColor: "",
          rotate: 0,
          scale: 1,
        },
        answer: {
          backgroundColor: "green",
          rotate: [30, -20, 15, -10, 0],
          scale: [1, 1.05, 1.1, 1.05, 1],
          transition: {
            duration: 0.5,
            ease: "easeInOut",
            type: "spring",
            damping: 8,
          },
        },
      }}
    >
      {text}
    </motion.button>
  );
};
