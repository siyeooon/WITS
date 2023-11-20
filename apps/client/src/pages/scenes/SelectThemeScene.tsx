import { useState } from "react";
import viteLogo from "/vite.svg";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

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
  }
> = ({ isSelected, isResult, ...attr }) => {
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

const SelectThemeScene: React.FC<{ themeResultIndex: number | undefined }> = ({
  themeResultIndex,
}) => {
  const [selectedId, setSelectedId] = useState<number>();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-xl font-bold">다음 게임의 테마를 정해주세요!</div>
      <div className="w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
        {new Array(6)
          .fill(0)
          .map((_, index) => index)
          .map((i) => (
            <ThemeSelectCard
              key={i}
              isSelected={i === selectedId}
              isResult={i === themeResultIndex}
              onClick={() => {
                setSelectedId(i);
              }}
            />
          ))}
      </div>
    </motion.div>
  );
};

export default SelectThemeScene;
