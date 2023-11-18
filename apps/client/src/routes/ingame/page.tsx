import { cn } from "../../lib/utils";
import viteLogo from "/vite.svg";

const InGameProgressBarItem: React.FC = () => {
  return (
    <div className="h-8 w-8 rounded-full bg-white border-4 border-green-500"></div>
  );
};
const InGameProgressBar: React.FC = () => {
  return (
    <div className="from-black to-white bg-gradient-to-r h-4 ">
      <div className="flex gap-2 justify-center ">
        {new Array(10)
          .fill(0)
          .map((_, index) => index)
          .map((i) => (
            <InGameProgressBarItem key={i} />
          ))}
      </div>
    </div>
  );
};

const AnswerButton: React.FC<{ isSelected?: boolean; isAnswer?: boolean }> = ({
  isSelected,
  isAnswer,
}) => {
  return (
    <button
      className={cn("bg-gray-300 h-20 rounded-2xl font-bold text-lg ", {
        "ring-8 ring-purple-500": isSelected,
        "bg-green-500 text-white": isAnswer,
      })}
    >
      FIESTA
    </button>
  );
};

const AnswerContainer: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <AnswerButton isSelected />
      <AnswerButton />
      <AnswerButton isAnswer />
      <AnswerButton />
    </div>
  );
};

export const InGamePage = () => {
  return (
    <div className="w-screen h-[100dvh]">
      <div className="container">
        <div className="flex flex-row gap-2 ">
          <img
            src={viteLogo}
            className="w-1/2 aspect-square rounded-2xl bg-slate-500 drop-shadow-md pointer-events-none"
          />
          <div className="flex flex-col justify-center">
            <div className="text-3xl font-bold">FIESTA</div>
            <div className="text-xl font-bold">IZ*ONE</div>
          </div>
        </div>

        <InGameProgressBar />

        <AnswerContainer />
      </div>
    </div>
  );
};
