import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import SelectThemeScene from "../../../components/scenes/SelectThemeScene";
import { InRoundScene } from "../../../components/scenes/InRoundScene";

const enum EGameStatus {
  SelectTheme,
  InGame,
  Result,
}

const enum ERoundStatus {
  SelectAnswer,
  Result,
}

export const SceneController = () => {
  const [gameStatus, setGameStatus] = useState<EGameStatus>(
    EGameStatus.SelectTheme
  );

  const [resultThemeIndex, setResultThemeIndex] = useState<number>();

  useEffect(() => {
    setTimeout(() => {
      setResultThemeIndex(Math.floor(Math.random() * 4));
      setGameStatus(EGameStatus.InGame);
    }, 3000);
  }, []);

  const SceneComponent = useMemo(() => {
    if (gameStatus === EGameStatus.SelectTheme) {
      return <SelectThemeScene key={2} themeResultIndex={resultThemeIndex} />;
    } else if (gameStatus === EGameStatus.InGame) {
      return <InRoundScene key={1} />;
    }
  }, [gameStatus, resultThemeIndex]);

  return <AnimatePresence mode="wait">{SceneComponent}</AnimatePresence>;
};
