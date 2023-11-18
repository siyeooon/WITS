import { cn } from "../../lib/utils";
import viteLogo from "/vite.svg";
import albumFiesta from "/Fiesta.jpg";
import { CrownIcon, CheckIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const AnswerButton: React.FC<{
  isDisabled: boolean;
  isSelected?: boolean;
  isAnswer?: boolean;
  text: string;
  onClick?: () => void;
}> = ({ isSelected, isAnswer, text, onClick }) => {
  return (
    <button
      className={cn(
        "bg-gray-300 h-20 rounded-2xl font-bold text-lg transition-colors",
        {
          "ring-8 ring-purple-500": isSelected,
          "bg-green-500 text-white": isAnswer,
        }
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const AnswerContainer: React.FC = () => {
  const [answerList, setAnswerList] = useState([
    "FIESTA",
    "Next Level",
    "Dun Dun Dance",
    "Gee",
  ]);
  const [isAnswerable, setIsAnswerable] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [answerIndex, setAnswerIndex] = useState<number>();

  useEffect(() => {
    const tempAnswerTimeout = setTimeout(() => {
      setAnswerIndex(Math.floor(Math.random() * 4));
    }, 1000);

    return () => {
      clearTimeout(tempAnswerTimeout);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      {answerList.map((answer, index) => (
        <AnswerButton
          text={answer}
          isDisabled={!isAnswerable}
          isSelected={index === selectedIndex}
          isAnswer={index === answerIndex}
          onClick={() => {
            setSelectedIndex(index);
          }}
        />
      ))}
    </div>
  );
};

const AnswerCard: React.FC = () => {
  return (
    <div className="flex flex-row gap-2">
      <img
        src={albumFiesta}
        className="w-1/2 aspect-square rounded-2xl bg-slate-500 drop-shadow-md pointer-events-none"
      />
      <div className="flex flex-col justify-center">
        <div className="text-3xl font-bold">FIESTA</div>
        <div className="text-xl font-bold">IZ*ONE</div>
      </div>
    </div>
  );
};

export const InGamePage = () => {
  return (
    <div className="w-screen h-[100dvh]">
      <div className="h-16 bg-slate-500">
        <span className="font-bold text-3xl text-white">WITS</span>
      </div>
      <div className="container h-[calc(100%-4rem)] flex flex-col p-4 gap-4">
        <div className="flex flex-row gap-2">
          <div className="relative inline-flex flex-col items-center">
            <div className="flex h-12 w-12 rounded-full bg-gray-500" />
            <div className="leading-none">43,815</div>
          </div>
          <div className="inline-flex flex-col items-center">
            <div className="flex h-12 w-12 rounded-full bg-gray-500" />
            <div className="leading-none">28,315</div>
          </div>
          <div className="inline-flex flex-col items-center">
            <div className="flex h-12 w-12 rounded-full bg-gray-500" />
            <div className="leading-none">13,515</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="font-bold">다음 노래의 제목은 무엇일까요?</div>
          <div className="flex-1">
            <AnswerCard />
          </div>
        </div>
        <div>
          <motion.div
            className="inset-x-0 bg-red-500 h-4 origin-left"
            initial={{
              scaleX: 1,
            }}
            animate={{
              scaleX: 0,
            }}
            transition={{ duration: 10, ease: "linear" }}
          />
        </div>
        <AnswerContainer />
      </div>
    </div>
  );
};
