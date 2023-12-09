import React, { useState } from "react";
import { cn } from "../../../../../lib/utils";
import { AnswerButton } from "./AnswerButton";

export const AnswerButtonContainer: React.FC<{
  answerList?: string[];
  answerIndex?: number;
}> = ({ answerIndex, answerList }) => {
  const [isAnswerable, setIsAnswerable] = useState<boolean>(true);
  const [selectedIndex, setSelectedIndex] = useState<number>();

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 p-4")}>
      {answerList?.map((answer, index) => (
        <AnswerButton
          text={answer}
          isDisabled={!isAnswerable}
          isSelected={index === selectedIndex}
          isAnswer={index === answerIndex}
          onClick={() => {
            if (isAnswerable) {
              setSelectedIndex(index);
              setIsAnswerable(false);
            }
          }}
        />
      ))}
    </div>
  );
};
