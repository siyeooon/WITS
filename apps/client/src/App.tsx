import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { cn } from "./lib/utils";

const Avatar: React.FC<{ text: string }> = ({ text }) => {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-gray-400 ring-4 ring-purple-600 h-6 w-6">
      <span className="font-medium text-sm text-black">{text}</span>
    </span>
  );
};

const AvatarHolder: React.FC<{ users: { name: string }[] }> = ({ users }) => {
  return (
    <>
      {/* 최대 N명 표기 */}
      {users.map((user) => (
        <Avatar text={user.name} />
      ))}
      {/* 최대 이후는 +로 표기 */}
      <Avatar text="5+" />
    </>
  );
};

const ThemeSelectCard: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { isSelected: boolean }
> = ({ isSelected, ...attr }) => {
  return (
    <div
      className={cn("relative rounded-3xl flex flex-col p-2 select-none", {
        "ring-8 ring-purple-500": isSelected,
      })}
      {...attr}
    >
      <img
        src={viteLogo}
        className="flex-1 aspect-square rounded-2xl bg-slate-500 drop-shadow-md pointer-events-none"
      />
      <div className="font-bold text-lg text-center">2020</div>

      <div className="absolute right-0 top-0 flex flex-row -space-x-2 ">
        <AvatarHolder
          users={[{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }]}
        />
      </div>
    </div>
  );
};

const ThemeSelectPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number>();

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
      {new Array(6)
        .fill(0)
        .map((_, index) => index)
        .map((i) => (
          <ThemeSelectCard
            key={i}
            isSelected={i === selectedId}
            onClick={() => {
              setSelectedId(i);
            }}
          />
        ))}
    </div>
  );
};

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
function App() {
  return (
    // <div className="w-screen h-[100dvh]">
    //   <div className="w-full h-full p-4">
    //     <div className="text-xl font-bold">다음 게임의 테마를 정해주세요!</div>
    //     <ThemeSelectPage />
    //     <InGameProgressBar />
    //   </div>
    // </div>
    <div className="w-screen h-[100dvh]">
      <div className="flex flex-row gap-2">
        <img
          src={viteLogo}
          className="w-1/2 aspect-square rounded-2xl bg-slate-500 drop-shadow-md pointer-events-none"
        />
        <div className="flex flex-col justify-center">
          <div className="text-3xl font-bold">FIESTA</div>
          <div className="text-xl font-bold">IZ*ONE</div>
        </div>
      </div>
      <AnswerContainer />
    </div>
  );
}

export default App;
