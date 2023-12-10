import { useEffect, useMemo, useState } from "react";
import viteLogo from "/vite.svg";
import { cn } from "../../../lib/utils";
import { motion } from "framer-motion";
import { useGameState } from "../useGameState";
import { TVoteThemeStageState } from "@wits/types";

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
  React.HTMLAttributes<HTMLDivElement> & {
    isSelected: boolean;
    isResult?: boolean;
    name: string;
  }
> = ({ name, isSelected, isResult, ...attr }) => {
  return (
    <div
      className={cn("relative rounded-3xl flex flex-col p-2 select-none", {
        "ring-8 ring-purple-500": isSelected,
        "bg-blue-300": isResult,
      })}
      {...attr}
    >
      <img
        src={viteLogo}
        className="aspect-square rounded-2xl bg-slate-500 drop-shadow-md pointer-events-none"
      />
      <div className="font-bold text-lg text-center">{name}</div>

      {/* <div className="absolute right-0 top-0 flex flex-row -space-x-2 ">
        <AvatarHolder
          users={[{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }]}
        />
      </div> */}
    </div>
  );
};

const SelectThemeScene: React.FC<{ state: TVoteThemeStageState }> = ({
  state,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();

  const canAnswer = useMemo(() => {
    return state.data.selectedThemeIndex === undefined;
  }, [state.data.selectedThemeIndex]);

  const resultIndex = useMemo(() => {
    return state.data.selectedThemeIndex;
  }, [state.data.selectedThemeIndex]);

  useEffect(() => {
    const timeout = setTimeout(() => {});

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <motion.div
      className="w-full h-full p-4 flex flex-col gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-xl font-bold text-center">
        다음 게임의 테마를 투표해주세요!
      </div>

      <div className="relative">
        <div className="absolute w-full rounded-full h-2 bg-gray-800" />
        <div
          className="absolute w-full rounded-full h-2 bg-purple-500 origin-left"
          style={{ transform: "scaleX(0.3)" }}
        />
      </div>

      <div className="mt-4 w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
        {state.data.themeList.map((themeInfo, i) => (
          <ThemeSelectCard
            key={i}
            name={themeInfo.name}
            isSelected={i === selectedIndex}
            isResult={i === resultIndex}
            onClick={() => {
              if (!canAnswer) return;
              setSelectedIndex(i);
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SelectThemeScene;
