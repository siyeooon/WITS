import React, { useMemo } from "react";
import { motion } from "framer-motion";
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
        "w-full h-12 rounded-md border-b-4 bg-blue-500 border-blue-700 text-white",
        "text-sm font-bold break-keep text-ellipsis whitespace-nowrap overflow-hidden px-4",
        {
          "bg-blue-300 border-blue-500": isDisabled,
          "bg-blue-500 border-blue-700 ring-4 ring-offset-2 ring-blue-500":
            isSelected,
          "bg-green-500 border-green-700": isAnswer,
        }
      )}
      onClick={onClick}
      animate={state}
      variants={{
        idle: {
          rotate: 0,
          scale: 1,
        },
        answer: {
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
