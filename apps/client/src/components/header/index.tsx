import { cn } from "../../lib/utils";
export const Header = () => {
  return (
    <div className={"flex flex-row justify-between items-center h-12 p-2"}>
      <div className={cn("text-xl font-logo text-black dark:text-white mt-2")}>
        WITS
      </div>
      <div className="flex flex-row gap-2">
        <img src="/src/assets/ingame/ranking.png" className="h-10 w-10" />
        <img src="/src/assets/ingame/profile.png" className="h-10 w-10" />
      </div>
    </div>
  );
};
